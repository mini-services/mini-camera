import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
	app.use(cookieParser())
	await app.listen(3000)

	const server = app.getHttpServer()
	const router = server._events.request._router

	// List all routes
	const availableRoutes: [] = router.stack
		.map((layer) => {
			if (layer.route) {
				return {
					route: {
						path: layer.route?.path,
						method: layer.route?.stack[0].method,
					},
				}
			}
		})
		.filter((item) => item !== undefined)
	console.info(availableRoutes)
}
bootstrap()
