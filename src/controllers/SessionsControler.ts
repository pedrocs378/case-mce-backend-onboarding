import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { sign } from 'jsonwebtoken'
import { classToClass } from "class-transformer";
import bcrypt from 'bcryptjs'

import { User } from "../database/schemas/User";

import authConfig from "../config/auth";

export class SessionsController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body

		try {
			const usersRepository = getMongoRepository(User)

			const user = await usersRepository.findOne({
				where: { email }
			})

			if (!user) {
				return res.status(401).json({ message: 'Email ou senha está incorreto' })
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password)

			if (!isPasswordMatch) {
				return res.status(401).json({ message: 'Email ou senha está incorreto' })
			}

			const { expiresIn, secret } = authConfig.jwt

			const token = sign({}, secret, {
				subject: String(user.id),
				expiresIn
			})

			return res.json({
				user: classToClass(user),
				token
			})
		} catch (err) {
			return res.status(500).send({ message: err })
		}
	}
}