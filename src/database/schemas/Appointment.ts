import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { ObjectID } from "mongodb"

import { User } from "./User"

@Entity('appointments')
export class Appointment {
	@ObjectIdColumn()
	id: ObjectID

	@Column(type => User)
	provider: User

	@Column()
	provider_id: ObjectID

	@Column(type => User)
	user: User

	@Column()
	user_id: ObjectID

	@Column('timestamp with time zone')
	date: Date

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}