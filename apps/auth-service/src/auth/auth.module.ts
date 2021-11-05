import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { VerifyService } from '../verify/verify.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RefreshTokensRepository } from './refreshToken.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersRepository } from '../user/user.repository'

@Module({
	controllers: [AuthController],
	providers: [AuthService, VerifyService],
	imports: [
		TypeOrmModule.forFeature([RefreshTokensRepository]),
		TypeOrmModule.forFeature([UsersRepository]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: 3600,
				},
			}),
		}),
	],
})
export class AuthModule {}
