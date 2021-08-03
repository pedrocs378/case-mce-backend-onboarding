import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { compare, hash } from "bcryptjs";

import { User } from "../database/schemas/User";

export class ResetPasswordController {

	public async update(req: Request, res: Response): Promise<Response> {
		const { email, password, password_confirmation } = req.body

		const usersRepository = getMongoRepository(User)

		if (password !== password_confirmation) {
			return res.status(400).json({ message: 'As senhas não batem' })
		}

		const user = await usersRepository.findOne({ email })

		if (!user) {
			return res.status(400).json({ message: 'Usuário inexistente' })
		}

		const checkOldPassword = await compare(password, user.password)

		if (checkOldPassword) {
			return res.status(400).json({ message: 'Sua nova senha deve ser diferente da senha antiga' })
		}

		user.password = await hash(password, 8)

		await usersRepository.save(user)

		return res.status(200).send()
	}
}