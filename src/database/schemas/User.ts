import {
	Column,
	CreateDateColumn,
	Entity,
	ObjectID,
	ObjectIdColumn,
	UpdateDateColumn
} from 'typeorm'
import { Exclude } from 'class-transformer'

type AccessLevelTypes = 'personal' | 'user' | 'admin'

@Entity('users')
export class User {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	name: string

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
}