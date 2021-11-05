import { Controller, Get } from '@nestjs/common'
import { CameraManagerService } from './camera-manager.service'

@Controller()
export class CameraManagerController {
	constructor(private readonly cameraManagerService: CameraManagerService) {}

	@Get()
	getHello(): string {
		return this.cameraManagerService.getHello()
	}
}
