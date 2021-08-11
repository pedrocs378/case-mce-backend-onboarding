import { Request, Response } from "express";
import { ObjectID } from "mongodb";
import { classToClass } from "class-transformer";
import { getMongoRepository } from "typeorm";
import { getDate, getHours, getMonth, getYear, isAfter, startOfDay, isWeekend } from "date-fns";

import { Appointment } from "../database/schemas/Appointment";
import { User } from "../database/schemas/User";
import { AvailabilityHours } from "../database/schemas/AvailabilityHours";

type AvailableHourData = {
	hour: number
	available: boolean
}

type BodyParams = {
	available_hours: AvailableHourData[]
	date: string
}

export class ProviderAvailableHoursController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { provider_id } = req.params
		const { available_hours, date } = req.body as BodyParams

		const selectedDate = startOfDay(new Date(date))

		if (isWeekend(selectedDate)) {
			return res.status(400).json({ message: 'Não é possivel atualizar horários do fim de semana' })
		}

		const usersRepository = getMongoRepository(User)
		const availabilityHoursRepository = getMongoRepository(AvailabilityHours)

		const provider = await usersRepository.findOne(provider_id)

		if (!provider) {
			return res.status(400).send('Provider não encontrado')
		}

		const existingAvailableHours = await availabilityHoursRepository.findOne({
			where: {
				date: selectedDate,
				provider_id: provider.id
			}
		})

		if (existingAvailableHours) {
			existingAvailableHours.available_hours = available_hours

			await availabilityHoursRepository.save(existingAvailableHours)

			return res.json(existingAvailableHours)
		} else {
			const availabilityHour = availabilityHoursRepository.create({
				provider_id: provider.id,
				available_hours,
				date: selectedDate
			})
	
			await availabilityHoursRepository.save(availabilityHour)
	
			return res.json(availabilityHour)
		}
	}

	public async index(req: Request, res: Response): Promise<Response> {
		try {
			const { provider_id } = req.params
			const { day, month, year } = req.query

			const date = {
				day: Number(day),
				month: Number(month),
				year: Number(year)
			}

			const appointmentsRepository = getMongoRepository(Appointment)
			const availableHoursRepository = getMongoRepository(AvailabilityHours)

			const appointmentsData = await appointmentsRepository.find({
				where: {
					'provider.id': new ObjectID(provider_id)
				}
			})

			const appointments = classToClass(appointmentsData)

			const appointmentsInDay = appointments
				.filter(appointment => {
					const appointmentDate = new Date(appointment.date)

					return (
						getDate(appointmentDate) === date.day &&
						getMonth(appointmentDate) + 1 === date.month &&
						getYear(appointmentDate) === date.year
					)
				})
				.map(appointment => {
					return {
						...appointment,
						provider: {
							...appointment.provider,
							id: appointment.provider_id
						},
						user: {
							...appointment.user,
							id: appointment.user_id
						},
					}
				})

			const existingAvailableHours = await availableHoursRepository.findOne({
				provider_id: new ObjectID(provider_id),
				date: new Date(date.year, date.month - 1, date.day)
			})

			const hourStart = 8

			const eachHourArray = Array.from({ length: 12 }, (_, index) => index + hourStart)

			const currentDate = new Date(Date.now())

			const availableHoursInDay = eachHourArray.map(hour => {
				const hasAppointmentinHour = appointmentsInDay.find(appointment => {
					return getHours(appointment.date) === hour
				})

				const isAvailableHour = existingAvailableHours 
					? existingAvailableHours.available_hours
						.find(existingHour => existingHour.hour === hour)?.available ?? true
					: true

				const compareDate = new Date(date.year, date.month - 1, date.day, hour)

				const available = 
					!hasAppointmentinHour && 
					isAfter(compareDate, currentDate) &&
					!isWeekend(compareDate) &&
					isAvailableHour &&
					hour !== 12

				return {
					hour,
					available,
					user: hasAppointmentinHour ? classToClass(hasAppointmentinHour.user) : null
				}
			})

			return res.json(availableHoursInDay)
		} catch (err) {
			console.error(err)

			return res.status(500).json(err)
		}
	}
}