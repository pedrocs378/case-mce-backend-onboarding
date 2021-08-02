import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { classToClass } from "class-transformer";
import { isAfter } from 'date-fns'

import { User } from "../database/schemas/User";
import { Appointment } from "../database/schemas/Appointment";

export class UserAppointmentsController {
	public async index(req: Request, res: Response): Promise<Response> {
		const { id: user_id } = req.user

		const usersRepository = getMongoRepository(User)
		const appointmentsRepository = getMongoRepository(Appointment)

		const user = await usersRepository.findOne(user_id)

		if (!user) {
			return res.status(400).json({ message: 'Usuário não existente' })
		}

		const appointments = await appointmentsRepository.find({
			where: {
				'user.id': user.id
			}
		})

		const nextAppointments = appointments
			.filter(appointment => {
				return isAfter(new Date(appointment.date), Date.now())
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

		return res.json(classToClass(nextAppointments))
	}
}