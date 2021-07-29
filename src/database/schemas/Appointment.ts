import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { ObjectID } from "mongodb"

interface User {
	id: ObjectID
	name: string
	phone: string
	avatar?: string | undefined
}

@Entity('appointments')
export class Appointment {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	provider: User

	@Column()
	user: User

	@Column('timestamp with time zone')
	date: Date

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}