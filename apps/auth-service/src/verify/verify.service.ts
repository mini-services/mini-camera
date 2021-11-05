import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Twilio } from 'twilio'
import { TwilioChannel } from './TwilioChannel.enum'

@Injectable()
export class VerifyService {
	private client: Twilio
	verifyServiceSid: string
	locale: string

	constructor(private configService: ConfigService) {
		const accountSid = this.configService.get('TWILIO_ACCOUNT_SID')
		const authToken = this.configService.get('TWILIO_AUTH_TOKEN')
		this.client = new Twilio(accountSid, authToken)

		this.verifyServiceSid = this.configService.get('TWILIO_VERIFY_SERVICE_SID')
		this.locale = this.configService.get('TWILIO_LOCALE')
	}

	async sendVerify(to: string, channel: TwilioChannel) {
		const verification = await this.client.verify
			.services(this.verifyServiceSid)
			.verifications.create({ locale: this.locale, to, channel })

		return verification
	}

	async checkVerify(to: string, code: string) {
		const verification = await this.client.verify
			.services(this.verifyServiceSid)
			.verificationChecks.create({ to, code })

		return { verification, isApproved: verification.status === 'approved' }
	}
}
