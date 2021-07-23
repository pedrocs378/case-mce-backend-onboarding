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
}