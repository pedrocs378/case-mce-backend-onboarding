import nodemailer from 'nodemailer'

export async function getMailerTransporter() {
	const testAccount = await nodemailer.createTestAccount()

	const transporter = nodemailer.createTransport({
		host: testAccount.smtp.host,
		port: testAccount.smtp.port,
		secure: testAccount.smtp.secure,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		},
	})

	return transporter
}