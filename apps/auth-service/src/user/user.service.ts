import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TwilioChannel } from '../verify/TwilioChannel.enum'
import { VerifyService } from '../verify/verify.service'
import { CreateUserDto } from './dto/create-user.dto'
import { PaginationDto } from './dto/pagination.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { Role } from './types/role.enum'
import { UsersRepository } from './user.repository'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private verifyService: VerifyService,
	) {}
	async create(createUserDto: CreateUserDto) {
		createUserDto.emailVerified = false
		createUserDto.phoneVerified = false

		const user = await this.usersRepository.create(createUserDto)

		await this.sendVerifyEmail(user.id)

		return user
	}

	async sendVerifyEmail(id: string) {
		const user = await this.usersRepository.findOneById(id)
		if (!user) {
			throw new BadRequestException('User not found')
		}

		if (user.emailVerified) throw new BadRequestException('User email is already verified')

		await this.verifyService.sendVerify(user.email, TwilioChannel.Email)
	}

	async findAll(paginationDto: PaginationDto, requestingUser: User) {
		if (requestingUser.role !== Role.Admin) {
			throw new UnauthorizedException()
		}

		return this.usersRepository.findAll(paginationDto)
	}

	async findOneByPhone(phone: string, requestingUser: User) {
		if (requestingUser.role !== Role.Admin) {
			if (phone !== requestingUser.phone) {
				throw new UnauthorizedException()
			}
		}

		return await this.usersRepository.findOneByPhone(phone)
	}

	async findOneById(id: string, requestingUser: User) {
		if (requestingUser.role !== Role.Admin) {
			if (id !== requestingUser.id) {
				throw new UnauthorizedException()
			}
		}

		return await this.usersRepository.findOneById(id)
	}

	async update(id: string, updateUserDto: UpdateUserDto, requestingUser: User) {
		if (requestingUser.role !== Role.Admin) {
			if (id !== requestingUser.id) {
				throw new UnauthorizedException('You are not allowed to update this user')
			}

			// Check if the user is updating fields that he's not allowed to update
			const allowedFields: (keyof User)[] = ['email', 'firstName', 'lastName', 'phone']

			const dtoContainsDisallowedFields = Object.keys(updateUserDto).some(
				(key: keyof User) => !allowedFields.includes(key),
			)
			if (dtoContainsDisallowedFields) {
				throw new UnauthorizedException(
					`You are only allowed to update these fields: ${allowedFields.join(',')}`,
				)
			}
		}

		if (updateUserDto.email) updateUserDto.emailVerified = false
		if (updateUserDto.phone) updateUserDto.phoneVerified = false

		const user = await this.usersRepository.update(id, updateUserDto)

		// TODO: refresh JWT token data

		return user
	}

	async remove(id: string, requestingUser: User) {
		if (requestingUser.role !== Role.Admin) {
			if (id !== requestingUser.id) {
				throw new UnauthorizedException()
			}
		}

		const user = await this.usersRepository.deleteUser(id)

		// TODO: if user was deleted, remove jwt

		return user
	}
}
