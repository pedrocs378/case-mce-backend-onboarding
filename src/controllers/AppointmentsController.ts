import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { classToClass } from "class-transformer";
import { getHours, isBefore, startOfHour, format, startOfDay } from "date-fns";

import { User } from "../database/schemas/User";
import { Appointment } from "../database/schemas/Appointment";
import { Notification } from "../database/schemas/Notification";
import { AvailabilityHours } from "../database/schemas/AvailabilityHours";

export class AppointmentsController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { id } = req.user
		const { provider_id, date } = req.body

		const appointmentDate = startOfHour(new Date(date))

		if (isBefore(appointmentDate, Date.now())) {
			return res.status(400).json({ message: 'Não é possivel agendar um horário que ja passou' })
		}

		if (id === provider_id) {
			return res.status(400).json({ message: 'Não é possivel agendar um horário com você mesmo' })
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 19) {
			return res.status(400).json({ message: 'Só é possivel agendar um horário das 08:00 até 20:00' })
		}

		const usersRepository = getMongoRepository(User)
		const appointmentsRepository = getMongoRepository(Appointment)
		const notificationsRepository = getMongoRepository(Notification)
		const availabilityHoursRepository = getMongoRepository(AvailabilityHours)

		const user = await usersRepository.findOne(id)
		const provider = await usersRepository.findOne(provider_id)

		if (!user) {
			return res.status(400).json({ message: 'Usuário não encontrado' })
		}

		if (!provider) {
			return res.status(400).json({ message: 'Personal trainer não encontrado' })
		}

		if (!provider.accessLevel.includes('personal')) {
			return res.status(400).json({ message: 'Este usuário não é um personal trainer' })
		}

		const hasAppointmentInSameDate = await appointmentsRepository.findOne({
			where: { date: appointmentDate }
		})

		if (hasAppointmentInSameDate) {
			return res.status(400).json({ message: 'Este horário já está agendado' })
		}

		const appointmentDateStartDay = startOfDay(appointmentDate)

		const hasHourAvailability = await availabilityHoursRepository.findOne({
			provider_id: provider.id,
			date: appointmentDateStartDay
		})

		if (hasHourAvailability) {
			const availabilityHour = hasHourAvailability.available_hours.find(availableHour => {
				return availableHour.hour === getHours(appointmentDate)
			})

			if (availabilityHour && !availabilityHour.available) {
				return res.status(400).json({ message: 'Este horário está indisponivel' })
			}
		}

		const appointment = appointmentsRepository.create({
			provider: {
				id: provider.id,
				name: provider.name,
				phone: provider.phone,
				avatar: provider.avatar
			},
			user: {
				id: user.id,
				name: user.name,
				phone: user.phone,
				avatar: user.avatar
			},
			date: appointmentDate,
			provider_id: provider.id,
			user_id: user.id
		})

		await appointmentsRepository.save(appointment)

		const dateFormatted = format(appointmentDate, "HH'h ('dd/MM')'")

		const notification = notificationsRepository.create({
			recipient_id: provider_id,
			content: `${user.name} reservou às ${dateFormatted}`,
			read: false
		})

		notificationsRepository.save(notification)

		return res.json(classToClass(appointment))
	}
}