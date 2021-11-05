import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, ManyToOne, Column } from 'typeorm'
import { DB_NOW } from '../../constants'
import { User } from '../../user/entities/user.entity'

@Entity()
export class RefreshToken {
	@PrimaryColumn({ unique: true })
	refreshToken: string

	@Column({ type: 'boolean' })
	isRevoked = false

	// Timestamps
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@DeleteDateColumn()
	deletedAt: Date

	@Column({ type: 'date', default: () => DB_NOW })
	lastUsed: Date

	@ManyToOne(() => User, (user) => user.refreshTokens)
	user: User
}
