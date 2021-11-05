import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../user/entities/user.entity'
import { UsersRepository } from '../user/user.repository'
import { JwtPayload } from './jwt-payload.interface'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private configService: ConfigService,
	) {
		super({
			secretOrKey: configService.get('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		})
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload
		const user: User = await this.usersRepository.findOneById(id)

		if (!user) {
			throw new UnauthorizedException()
		}

		return user
	}
}
