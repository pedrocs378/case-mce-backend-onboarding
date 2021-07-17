import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity('user_tokens')
export class UserToken {
	@ObjectIdColumn()
	id: ObjectId

	@Column()
	token: string

	@Column()
	user_id: ObjectId

	@Column()
	expiresIn: Date

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}