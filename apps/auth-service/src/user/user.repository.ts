import { EntityRepository, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { PaginationDto } from './dto/pagination.dto'

const UNIQUE_EXCEPTION_CODE = '23505'
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
	async createUser(createUserDto: CreateUserDto): Promise<User> {
		const user = this.create(createUserDto)

		try {
			return await this.save(user)
			// TODO: send verify email
		} catch (error) {
			if (error.code === UNIQUE_EXCEPTION_CODE) {
				throw new ConflictException('email/phone already exists')
			} else {
				throw new InternalServerErrorException()
			}
		}
	}
	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
		try {
			// Make sure the user is not deleted
			const user = await this.findOne({ id }, { withDeleted: false })
			if (!user) throw new NotFoundException('User not found')

			await this.update(id, updateUserDto)
		} catch (error) {
			if (error.code === UNIQUE_EXCEPTION_CODE) {
				throw new ConflictException('email/phone already exists')
			} else {
				throw new InternalServerErrorException()
			}
		}
	}

	async findOneByPhone(phone: string): Promise<User> {
		const user = await this.findOne({ phone }, { withDeleted: false })
		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async findOneById(id: string): Promise<User> {
		const user = await this.findOne({ id }, { withDeleted: false })
		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async deleteUser(id: string): Promise<void> {
		const { affected } = await this.softDelete(id)
		if (affected === 0) throw new NotFoundException('User not found')
	}

	async findAll(paginationDto: PaginationDto): Promise<User[]> {
		const { skip, take } = paginationDto

		return await this.find({ skip, take, withDeleted: true })
	}
}
