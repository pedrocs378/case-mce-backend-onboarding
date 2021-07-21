import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { getHours, isBefore, startOfHour } from "date-fns";

import { User } from "../database/schemas/User";
import { Appointment } from "../database/schemas/Appointment";

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

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 20) {
			return res.status(400).json({ message: 'Só é possivel agendar um horário das 08:00 até 20:00' })
		}

		const usersRepository = getMongoRepository(User)
		const appointmentsRepository = getMongoRepository(Appointment)

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

		const appointment = appointmentsRepository.create({
			provider_id: provider.id,
			user_id: user.id,
			date: appointmentDate
		})

		await appointmentsRepository.save(appointment)

		return res.json(appointment)
	}
}