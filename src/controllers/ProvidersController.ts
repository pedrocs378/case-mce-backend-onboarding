import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { classToClass } from "class-transformer";
import { ObjectID } from 'mongodb'
import { isAfter, isBefore } from "date-fns";

import { User } from "../database/schemas/User";
import { Appointment } from "../database/schemas/Appointment";

export class ProvidersController {

	public async index(req: Request, res: Response): Promise<Response> {
		const { id: user_id } = req.user

		const usersRepository = getMongoRepository(User)

		const providers = await usersRepository.find({
			where: {
				$and: [
					{
						_id: {
							$ne: new ObjectID(user_id)
						}
					},
					{
						accessLevel: {
							$in: ['personal']
						}
					}
				]
			}
		})

		return res.json(classToClass(providers))
	}
	public async show(req: Request, res: Response): Promise<Response> {
		const { provider_id } = req.params

		const usersRepository = getMongoRepository(User)
		const appointmentsRepository = getMongoRepository(Appointment)

		const providerData = await usersRepository.findOne(provider_id)

		if (!providerData || !providerData.accessLevel.includes('personal')) {
			return res.status(400).json({ message: 'Personal não existente' })
		}

		const appointmentsWithProvider = await appointmentsRepository.find({
			where: {
				'provider.id': providerData.id
			}
		})

		const nextAppointments = appointmentsWithProvider
			.filter(appointment => {
				return isAfter(new Date(appointment.date), Date.now())
			})
			.sort((a, b) => {
				if (isBefore(a.date, b.date)) return -1
				if (isAfter(a.date, b.date)) return 1
				else return 0
			})

		const provider = classToClass(providerData)

		return res.json({
			...provider,
			appointments: nextAppointments
		})
	}
}