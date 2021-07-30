import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { ObjectID } from 'mongodb'

import { User } from "../database/schemas/User";

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

		return res.json(providers)
	}
	public async show(req: Request, res: Response): Promise<Response> {
		const { provider_id } = req.params

		const usersRepository = getMongoRepository(User)

		const provider = await usersRepository.findOne(provider_id)

		if (!provider || !provider.accessLevel.includes('personal')) {
			return res.status(400).json({ message: 'Personal não existente' })
		}

		return res.json(provider)
	}
}