import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";

import { Notification } from "../database/schemas/Notification";
import { User } from "../database/schemas/User";

export class NotificationsController {

	public async index(req: Request, res: Response): Promise<Response> {
		const { id: provider_id } = req.user

		const notificationsRepository = getMongoRepository(Notification)
		const usersRepository = getMongoRepository(User)

		const user = await usersRepository.findOne(provider_id)

		if (!user || !user.accessLevel.includes('personal')) {
			return res.status(401).json({ message: 'Você não tem permissão para isso' })
		}

		const notifications = await notificationsRepository.find({
			recipient_id: provider_id
		})

		return res.json(notifications)
	}
}