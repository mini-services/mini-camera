import { Module } from '@nestjs/common'
import { CameraManagerController } from './camera-manager.controller'
import { CameraManagerService } from './camera-manager.service'

@Module({
	imports: [],
	controllers: [CameraManagerController],
	providers: [CameraManagerService],
})
export class CameraManagerModule {}
