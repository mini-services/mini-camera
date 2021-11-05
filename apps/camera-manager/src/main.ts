import { NestFactory } from '@nestjs/core'
import { CameraManagerModule } from './camera-manager.module'

async function bootstrap() {
	const app = await NestFactory.create(CameraManagerModule)
	await app.listen(3000)
}
bootstrap()
