import { Injectable } from '@nestjs/common'

@Injectable()
export class CameraManagerService {
	getHello(): string {
		return 'Hello World!'
	}
}
