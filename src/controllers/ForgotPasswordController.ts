import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import path from 'path'

import { getMailerTransporter } from "../modules/mailer";
import { MailProvider } from "../providers/MailProvider";

import { User } from "../database/schemas/User";
import { UserToken } from "../database/schemas/UserToken";

export class ForgotPasswordController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { email } = req.body

		const usersRepository = getMongoRepository(User)
		const userTokensRepository = getMongoRepository(UserToken)

		const user = await usersRepository.findOne({ email })

		if (!user) {
			return res.status(400).json({ message: 'Usuário não encontrado' })
		}

		const token = ("0" + (Math.floor(Math.random() * (99999 - 0 + 1)) + 0)).substr(-5)

		const expiresIn = new Date()
		expiresIn.setHours(expiresIn.getHours() + 1)

		const userToken = userTokensRepository.create({ user_id: user.id, token, expiresIn })

		await userTokensRepository.save(userToken)

		const transporter = await getMailerTransporter()
		const mailProvider = new MailProvider(transporter)

		const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.html')

		await mailProvider.sendMail({
			to: {
				name: user.name,
				email: user.email
			},
			from: {
				name: 'Pedro',
				email: 'pedrocs378@gmail.com'
			},
			subject: 'Recuperação de senha',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name,
					token: userToken.token
				}
			}
		})

		return res.status(200).send()
	}
}