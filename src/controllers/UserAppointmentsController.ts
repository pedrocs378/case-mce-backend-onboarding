import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { getDate, getMonth, getYear } from 'date-fns'

import { User } from "../database/schemas/User";
import { Appointment } from "../database/schemas/Appointment";

export class UserAppointmentsController {
	public async index(req: Request, res: Response): Promise<Response> {
		const { id } = req.user
		const { day, month, year } = req.query

		const usersRepository = getMongoRepository(User)
		const appointmentsRepository = getMongoRepository(Appointment)

		const user = await usersRepository.findOne(id)

		if (!user) {
			return res.status(400).json({ message: 'Usuário não existente' })
		}

		const appointments = await appointmentsRepository.find({
			where: {
				user_id: user.id
			}
		})

		const appointmentsInDay = appointments.filter(appointment => {
			const appointmentDate = new Date(appointment.date)

			return (
				getDate(appointmentDate) === Number(day) &&
				getMonth(appointmentDate) === Number(month) &&
				getYear(appointmentDate) === Number(year)
			)
		})

		return res.json(appointmentsInDay)
	}
}