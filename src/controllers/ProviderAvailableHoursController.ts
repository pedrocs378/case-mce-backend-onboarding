import { Request, Response } from "express";
import { ObjectID } from "mongodb";
import { getMongoRepository } from "typeorm";
import { getDate, getHours, getMonth, getYear, isAfter } from "date-fns";

import { Appointment } from "../database/schemas/Appointment";
import { User } from "../database/schemas/User";

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
		const usersRepository = getMongoRepository(User)

		const appointments = await appointmentsRepository.find({
			where: {
				provider_id: new ObjectID(provider_id)
			}
		})

		const appointmentsInDay = appointments.filter(appointment => {
			const appointmentDate = new Date(appointment.date)

			return (
				getDate(appointmentDate) === date.day &&
				getMonth(appointmentDate) === date.month &&
				getYear(appointmentDate) === date.year
			)
		})

		const hourStart = 8

		const eachHourArray = Array.from({ length: 12 }, (_, index) => index + hourStart)

		const currentDate = new Date(Date.now())

		const availableHoursInDay = eachHourArray.map(hour => {
			const hasAppointmentinHour = appointmentsInDay.find(appointment => {
				return getHours(appointment.date) === hour
			})

			const compareDate = new Date(date.year, date.month - 1, date.day, hour)

			return {
				hour,
				available: hasAppointmentinHour 
					? hasAppointmentinHour.user
					: isAfter(compareDate, currentDate) ? true : false
			}
		})

		return res.json(availableHoursInDay)
	}
}