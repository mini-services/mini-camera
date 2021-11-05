import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersRepository } from '../user/user.repository'
import { TwilioChannel } from '../verify/TwilioChannel.enum'
import { VerifyService } from '../verify/verify.service'
import { JwtPayload } from './jwt-payload.interface'
import { RefreshTokensRepository } from './refreshToken.repository'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'
import { LoginPhoneSendDto } from './dto/loginPhoneSend.dto'
import { LoginPhoneVerifyDto } from './dto/loginPhoneVerify.dto'
import { LogoutDto } from './dto/logout.dto'
import { LoginRefreshTokenDto } from './dto/loginRefreshToken.dto'
import { REFRESH_TOKEN_COOKIE_MAX_AGE } from '../constants'

@Injectable()
export class AuthService {
	constructor(
		private verifyService: VerifyService,
		private jwtService: JwtService,
		@InjectRepository(RefreshTokensRepository)
		private refreshTokensRepository: RefreshTokensRepository,
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
	) {}
	async loginPhoneSend(loginPhoneSendDto: LoginPhoneSendDto) {
		const { phone } = loginPhoneSendDto
		await this.verifyService.sendVerify(phone, TwilioChannel.Sms)
	}
	async loginPhoneVerify(
		loginPhoneVerifyDto: LoginPhoneVerifyDto,
	): Promise<{ accessToken: string; refreshToken?: string }> {
		const { phone, code, rememberMe } = loginPhoneVerifyDto

		const { isApproved } = await this.verifyService.checkVerify(phone, code)
		if (!isApproved) throw new UnauthorizedException('Invalid code')

		const user = await this.usersRepository.findOneByPhone(loginPhoneVerifyDto.phone)
		const accessToken: string = await this.createAccessToken(user)

		let refreshToken
		if (rememberMe) {
			const token = await this.refreshTokensRepository.createRefreshToken(user)
			refreshToken = token.refreshToken
		}

		return { accessToken, refreshToken }
	}

	async loginRefreshToken(loginRefreshTokenDto: LoginRefreshTokenDto) {
		const { refreshToken } = loginRefreshTokenDto

		try {
			const token = await this.refreshTokensRepository.findOne({ refreshToken }, { withDeleted: false })
			if (!token) throw new UnauthorizedException('Invalid refresh token')
			if (token.lastUsed.getTime() < Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE) {
				throw new UnauthorizedException('Refresh token has expired')
			}
			if (token.isRevoked) throw new UnauthorizedException('Refresh token has been revoked')

			this.refreshTokensRepository.updateRefreshTokenLastUsed(token.refreshToken)

			const accessToken: string = await this.createAccessToken(token.user)

			return { accessToken }
		} catch (e) {}
	}

	private async createAccessToken(user: User): Promise<string> {
		const payload: JwtPayload = {
			id: user.id,
			phone: user.phone,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
		}

		return await this.jwtService.sign(payload)
	}

	async logout(logoutDto: LogoutDto) {
		const { refreshToken } = logoutDto
		await this.refreshTokensRepository.revokeRefreshToken(refreshToken)
	}
}
