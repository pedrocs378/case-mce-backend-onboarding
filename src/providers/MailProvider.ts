import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

interface TemplateVariables {
	[key: string]: string | number
}

interface MailContact {
	name: string
	email: string
}

interface SendMailData {
	to: MailContact
	from: MailContact
	subject: string
	templateData: {
		file: string
		variables: TemplateVariables
	}
}

export class MailProvider {
	private client: Transporter

	constructor(transporter: Transporter) {
		this.client = transporter
	}

	public async sendMail({ to, from, subject, templateData }: SendMailData): Promise<void> {
		const templateContent = await fs.promises.readFile(templateData.file, {
			encoding: 'utf-8'
		})

		const parseTemplate = handlebars.compile(templateContent)

		const html = parseTemplate(templateData.variables)

		const message = await this.client.sendMail({
			to: {
				name: to.name,
				address: to.email
			},
			from: {
				name: from.name,
				address: from.email
			},
			subject,
			html
		})

		console.log('URL:', nodemailer.getTestMessageUrl(message))
	}
}