import { getMongoRepository } from "typeorm";
import { hash } from "bcryptjs";

import { User } from "../database/schemas/User";

type CreateUserProps = {
	user: {
		name: string
		phone: string
		email: string
		password: string
	},
	userAccessLevel: 'user' | 'personal'
}

export class CreateUserService {
	public async execute({ user, userAccessLevel }: CreateUserProps): Promise<User> {
		const usersRepository = getMongoRepository(User)

		const hasAlreadyUser = await usersRepository.findOne({
			where: { email: user.email }
		})

		if (hasAlreadyUser) {
			throw new Error('Este usuário já foi registrado')
		}

		const hashedPassword = await hash(user.password, 8)

		const createUser = usersRepository.create({
			...user,
			password: hashedPassword,
			accessLevel: [userAccessLevel]
		})

		await usersRepository.save(createUser)

		return createUser
	}
}