import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersRepository } from './user.repository'
import { VerifyService } from '../verify/verify.service'

@Module({
	imports: [TypeOrmModule.forFeature([UsersRepository])],
	controllers: [UserController],
	providers: [UserService, VerifyService],
})
export class UserModule {}
