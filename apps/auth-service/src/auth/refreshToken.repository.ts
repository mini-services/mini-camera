import { EntityRepository, Repository } from 'typeorm'
import { RefreshToken } from './entities/refreshToken.entity'
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import cryptoRandomString from 'crypto-random-string'
import { User } from '../user/entities/user.entity'
import { DB_NOW } from '../constants'

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken> {
	async createRefreshToken(user: User): Promise<RefreshToken> {
		const randomToken = await cryptoRandomString.async({ length: 32 })
		const refreshToken = this.create({ refreshToken: randomToken, user })

		try {
			return await this.save(refreshToken)
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async findRefreshTokenByToken(token: string): Promise<RefreshToken> {
		try {
			const refreshToken = await this.findOne({ refreshToken: token })
			if (!refreshToken) {
				throw new NotFoundException('Refresh token not found')
			}
			return refreshToken
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async updateRefreshTokenLastUsed(refreshToken: string): Promise<void> {
		try {
			const { affected } = await this.update({ refreshToken }, { lastUsed: DB_NOW })
			if (affected === 0) {
				throw new NotFoundException('Refresh token not found')
			}
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async revokeRefreshToken(refreshToken: string): Promise<void> {
		try {
			const { affected } = await this.update({ refreshToken }, { isRevoked: true })
			if (affected === 0) {
				throw new NotFoundException('Refresh token not found')
			}
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async deleteRefreshToken(refreshToken: string): Promise<void> {
		try {
			const { affected } = await this.softDelete({ refreshToken })
			if (affected === 0) {
				throw new NotFoundException('Refresh token not found')
			}
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}
}
