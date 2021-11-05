import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class CreateUserDto {
	// Identification
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsBoolean()
	emailVerified = false

	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string

	@IsBoolean()
	phoneVerified = false

	@IsNotEmpty()
	firstName: string

	@IsNotEmpty()
	lastName: string
}
