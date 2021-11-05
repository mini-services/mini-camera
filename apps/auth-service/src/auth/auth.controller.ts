import { Controller, Post, Body, Res, UnauthorizedException, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginPhoneVerifyDto } from './dto/loginPhoneVerify.dto'
import { LoginPhoneSendDto } from './dto/loginPhoneSend.dto'
import { LogoutDto } from './dto/logout.dto'
import { Request, Response } from 'express'
import { REFRESH_TOKEN_COOKIE_KEY, REMEMBER_ME_COOKIE_KEY } from '../constants'
import { ConfigService } from '@nestjs/config'
import { Environment } from '../config/types/env.enum'
import { LoginRefreshTokenDto } from './dto/loginRefreshToken.dto'
import { setRefreshTokenCookies } from './utils/setRefreshTokenCookies'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

	@Post('login/phone/send')
	async loginPhoneSend(@Body() loginPhoneSendDto: LoginPhoneSendDto) {
		await this.authService.loginPhoneSend(loginPhoneSendDto)
	}
	@Post('login/phone/verify')
	async loginPhoneVerify(
		@Res({ passthrough: true }) response: Response,
		@Body() loginPhoneVerifyDto: LoginPhoneVerifyDto,
	) {
		const { accessToken, refreshToken } = await this.authService.loginPhoneVerify(loginPhoneVerifyDto)

		const isProduction = this.configService.get('ENVIRONMENT') === Environment.Production
		if (refreshToken) setRefreshTokenCookies(response, refreshToken, isProduction)

		return { accessToken }
	}

	@Post('login/refresh-token')
	async loginRefreshToken(@Req() request: Request, @Res() response: Response) {
		const loginRefreshTokenDto = new LoginRefreshTokenDto()
		loginRefreshTokenDto.refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY]

		try {
			const { accessToken } = await this.authService.loginRefreshToken(loginRefreshTokenDto)

			setRefreshTokenCookies(response, request.cookies[REFRESH_TOKEN_COOKIE_KEY], request.secure)

			return { accessToken }
		} catch (e) {
			// If the refresh token is invalid, remove it
			if (e instanceof UnauthorizedException) {
				response.clearCookie(REFRESH_TOKEN_COOKIE_KEY)
				response.clearCookie(REMEMBER_ME_COOKIE_KEY)
			}

			throw e
		}
	}

	@Post('/logout')
	async logout(@Req() request: Request, @Res() response: Response) {
		const logoutDto = new LogoutDto()
		logoutDto.refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY]

		await this.authService.logout(logoutDto)

		response.clearCookie(REFRESH_TOKEN_COOKIE_KEY)
		response.clearCookie(REMEMBER_ME_COOKIE_KEY)
	}
}
