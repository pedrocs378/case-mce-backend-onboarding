import {
	Column,
	Entity,
	ObjectID,
	ObjectIdColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

type AccessLevelTypes = 'personal' | 'user' | 'admin'

@Entity('users')
export class User {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	name: string

	@Column()
	phone: string

	@Column({ nullable: false, unique: true })
	email: string

	@Column()
	avatar: string

	@Column({ nullable: false })
	@Exclude()
	password: string

	@Column({ nullable: false, array: true })
	accessLevel: AccessLevelTypes[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@Expose({ name: 'avatar_url' })
	getAvatarUrl(): string | null {
		if (!this.avatar) return null

		return `http://192.168.0.103:3333/files/${this.avatar}`
	}
}