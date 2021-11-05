import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import sendgridMail from '@sendgrid/mail'

@Injectable()
export class EmailService {
	private mail = sendgridMail
	private fromEmail: string
	constructor(private configService: ConfigService) {
		this.fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL')
		this.mail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'))
	}

	async send(emailData: Omit<sendgridMail.MailDataRequired, 'from'>) {
		const email = { ...emailData, from: this.fromEmail } as sendgridMail.MailDataRequired

		await sendgridMail.send(email)
	}
}
