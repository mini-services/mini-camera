import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { GetUser } from './utils/getUser.decorator'
import { User } from './entities/user.entity'
import { PaginationDto } from './dto/pagination.dto'

@Controller('authentication/users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	signUp(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Get(':id')
	findOne(@Param('id') id: string, @GetUser() user: User) {
		return this.userService.findOneById(id, user)
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
		return this.userService.findAll(paginationDto, user)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
		return this.userService.update(id, updateUserDto, user)
	}

	@Delete(':id')
	remove(@Param('id') id: string, @GetUser() user: User) {
		return this.userService.remove(id, user)
	}
}
