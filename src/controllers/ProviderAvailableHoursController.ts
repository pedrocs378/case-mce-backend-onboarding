import { Request, Response } from "express";
import { ObjectID } from "mongodb";
import { classToClass } from "class-transformer";
import { getMongoRepository } from "typeorm";
import { getDate, getHours, getMonth, getYear, isAfter } from "date-fns";

import { Appointment } from "../database/schemas/Appointment";

export class ProviderAvailableHoursController {

	public async index(req: Request, res: Response): Promise<Response> {
		const { provider_id } = req.params
		const { day, month, year } = req.query

		const date = {
			day: Number(day),
			month: Number(month),
			year: Number(year)
		}

		const appointmentsRepository = getMongoRepository(Appointment)

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

		const hourStart = 8

		const eachHourArray = Array.from({ length: 12 }, (_, index) => index + hourStart)

		const currentDate = new Date(Date.now())

		const availableHoursInDay = eachHourArray.map(hour => {
			const hasAppointmentinHour = appointmentsInDay.find(appointment => {
				return getHours(appointment.date) === hour
			})

			const compareDate = new Date(date.year, date.month - 1, date.day, hour)

			const available = !hasAppointmentinHour && isAfter(compareDate, currentDate)

			return {
				hour,
				available,
				user: hasAppointmentinHour ? classToClass(hasAppointmentinHour.user) : null
			}
		})

		return res.json(availableHoursInDay)
	}
}