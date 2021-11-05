import { PartialType } from '@nestjs/mapped-types'
import { Role } from '../types/role.enum'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
	role?: Role
}
