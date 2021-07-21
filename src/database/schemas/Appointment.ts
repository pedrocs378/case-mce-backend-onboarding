import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { ObjectID } from "mongodb"

@Entity('appointments')
export class Appointment {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	provider_id: ObjectID

	@Column()
	user_id: ObjectID

	@Column('timestamp with time zone')
	date: Date

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}