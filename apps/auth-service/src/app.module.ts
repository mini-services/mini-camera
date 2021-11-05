import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configValidationSchema } from './config/config.schema'
import { Environment } from './config/types/env.enum'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: configValidationSchema,
			isGlobal: true,
			envFilePath: '.development.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const isProduction = configService.get('ENVIRONMENT') === Environment.Production

				return {
					ssl: isProduction,
					extra: {
						ssl: isProduction ? { rejectUnauthorized: false } : null,
					},
					type: 'postgres',
					autoLoadEntities: true,
					synchronize: true, // TODO: Remove on production
					host: configService.get('DB_HOST'),
					port: configService.get('DB_PORT'),
					username: configService.get('DB_USERNAME'),
					password: configService.get('DB_PASSWORD'),
					database: configService.get('DB_DATABASE'),
				}
			},
		}),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
