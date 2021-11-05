import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	OneToMany,
} from 'typeorm'
import { RefreshToken } from '../../auth/entities/refreshToken.entity'
import { Role } from '../types/role.enum'

@Entity()
export class User {
	// Identification
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'enum', enum: Role })
	role: Role

	@Column({ unique: true })
	email: string

	@Column({ default: false })
	emailVerified: boolean

	@Column({ unique: true })
	phone: string

	@Column({ default: false })
	phoneVerified: boolean

	// UserReadWrite
	@Column()
	firstName: string

	@Column()
	lastName: string

	// Timestamps
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@DeleteDateColumn()
	deletedAt: Date

	// Relationships
	@OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
	refreshTokens: Promise<RefreshToken[]>
}
