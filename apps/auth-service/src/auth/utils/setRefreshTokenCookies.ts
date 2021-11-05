import { Response } from 'express'

import { REFRESH_TOKEN_COOKIE_MAX_AGE, REFRESH_TOKEN_COOKIE_KEY, REMEMBER_ME_COOKIE_KEY } from '../../constants'

export function setRefreshTokenCookies(response: Response, refreshToken: string, isSecure: boolean) {
	response.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
		maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
		httpOnly: true,
		secure: isSecure,
	})
	response.cookie(REMEMBER_ME_COOKIE_KEY, true, {
		maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
		secure: isSecure,
	})
}
