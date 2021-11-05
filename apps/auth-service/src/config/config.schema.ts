import * as Joi from 'joi'
import { Environment } from './types/env.enum'

export const configValidationSchema = Joi.object({
	// General
	PORT: Joi.number().default(3000),
	ENVIRONMENT: Joi.string()
		.valid(Environment.Development, Environment.Staging, Environment.Production)
		.default(Environment.Production),

	// Auth
	JWT_SECRET: Joi.string().required(),

	// Database
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().default(5432).required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),

	// Twilio
	TWILIO_ACCOUNT_SID: Joi.string().required(),
	TWILIO_AUTH_TOKEN: Joi.string().required(),
	TWILIO_VERIFY_SERVICE_SID: Joi.string().required(),
	TWILIO_LOCALE: Joi.string().required(),
})
