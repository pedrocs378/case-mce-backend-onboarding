import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { isAfter } from "date-fns";

import { User } from "../database/schemas/User";
import { UserToken } from "../database/schemas/UserToken";

export class ValidateTokenController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { email, token } = req.body

		const usersRepository = getMongoRepository(User)
		const userTokensRepository = getMongoRepository(UserToken)

		const user = await usersRepository.findOne({ email })

		if (!user) {
			return res.status(400).json({ message: 'Usuário não encontrado' })
		}

		const userToken = await userTokensRepository.findOne({ 
			token,
			user_id: user.id
		})

		if (!userToken) {
			return res.status(400).json({ message: 'Token não encontrado' })
		}

		if (isAfter(Date.now(), userToken.expiresIn)) {
			return res.status(400).json({ message: 'Token expirado' })
		}

		await userTokensRepository.deleteOne({ token, user_id: user.id })

		return res.status(200).json({
			user_id: user.id,
			email: user.email
		})
	}
}