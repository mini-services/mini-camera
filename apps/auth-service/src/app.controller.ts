import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
	@Get('status')
	statusCheck(): string {
		return 'OK'
	}
}
