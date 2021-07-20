import { Request, Response } from "express";
import { classToClass } from "class-transformer";

import { CreateUserService } from "../services/CreateUserService";

export class UsersController {

	public async create(req: Request, res: Response): Promise<Response> {
		const {
			name,
			phone,
			email,
			password,
			password_confirmation
		} = req.body

		try {
			if (password !== password_confirmation) {
				return res.status(400).json({ message: 'A senha e a confirmação da senha precisam ser iguais' })
			}

			const createUser = new CreateUserService()

			const user = await createUser.execute({
				user: {
					name,
					phone,
					email,
					password,
				},
				userAccessLevel: 'user'
			})
	
			return res.json(classToClass(user))
		} catch (err) {
			if (err instanceof Error) {
				return res.status(400).json({ message: err.message })
			}

			return res.status(500).json({ message: err.message })
		}
	}
}