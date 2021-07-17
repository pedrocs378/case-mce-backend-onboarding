import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { hash } from 'bcryptjs'
import { classToClass } from "class-transformer";

import { User } from "../database/schemas/User";

export class UsersController {

	public async create(req: Request, res: Response): Promise<Response> {
		const {
			name,
			email,
			password,
			password_confirmation
		} = req.body

		if (password !== password_confirmation) {
			return res.status(400).json({ message: 'A senha e a confirmação da senha precisam ser iguais' })
		}

		const usersRepository = getMongoRepository(User)

		const hasAlreadyUser = await usersRepository.findOne({
			where: { email }
		})

		if (hasAlreadyUser) {
			return res.status(400).json({ message: 'Este usuário já foi registrado' })
		}

		const hashedPassword = await hash(password, 8)

		const user = usersRepository.create({
			name,
			email,
			password: hashedPassword,
			accessLevel: ['user']
		})

		await usersRepository.save(user)

		return res.json(classToClass(user))
	}
}