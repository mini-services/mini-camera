import { Test, TestingModule } from '@nestjs/testing'
import { CameraManagerController } from './camera-manager.controller'
import { CameraManagerService } from './camera-manager.service'

describe('CameraManagerController', () => {
	let cameraManagerController: CameraManagerController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [CameraManagerController],
			providers: [CameraManagerService],
		}).compile()

		cameraManagerController = app.get<CameraManagerController>(CameraManagerController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(cameraManagerController.getHello()).toBe('Hello World!')
		})
	})
})
