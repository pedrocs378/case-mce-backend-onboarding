import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { ObjectID } from "mongodb"

type AvailableHourData = {
	hour: number
	available: boolean
}

@Entity('availability_hours')
export class AvailabilityHours {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	provider_id: ObjectID

	@Column()
	date: Date

	@Column()
	available_hours: AvailableHourData[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}