import { Request, Response } from "express";
import { classToClass } from "class-transformer";
import { getMongoRepository } from "typeorm";
import fs from 'fs'
import path from 'path'

import { uploadConfig } from "../config/multer";

import { User } from "../database/schemas/User";

export class UserAvatarController {

	public async update(req: Request, res: Response): Promise<Response> {
		const { id } = req.user
		const avatarFileName = req.file?.filename ?? ''

		const usersRepository = getMongoRepository(User)

		const user = await usersRepository.findOne(id)

		if (!user) {
			return res.status(400).json({ message: 'Usuário não existente' })
		}

		if (user.avatar) {
			const filePath = path.resolve(uploadConfig.uploadsFolder, user.avatar)
			
			try {
				await fs.promises.stat(filePath)
			} catch {
				return res.status(400).json({ message: 'Algo aconteceu de errado. Tente novamente.' })
			}

			await fs.promises.unlink(filePath)
		}

		await fs.promises.rename(
			path.resolve(uploadConfig.tmpFolder, avatarFileName),
			path.resolve(uploadConfig.uploadsFolder, avatarFileName),
		)

		user.avatar = avatarFileName

		await usersRepository.save(user)

		return res.json(classToClass(user))
	}
}