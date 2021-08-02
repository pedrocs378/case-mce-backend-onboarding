import path from 'path'
import crypto from 'crypto'
import multer from 'multer'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

export const uploadConfig = {
	tmpFolder,
	uploadsFolder: path.resolve(tmpFolder, 'uploads'),
	multer: {
		storage: multer.diskStorage({
			destination: tmpFolder,
			filename (_, file, callback) {
				const fileHash = crypto.randomBytes(10).toString('hex')
				const fileName = `${fileHash}-${file.originalname}`

				return callback(null, fileName)
			}
		})
	}
}