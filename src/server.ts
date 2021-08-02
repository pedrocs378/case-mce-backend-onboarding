import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { uploadConfig } from './config/multer'

import { routes } from './routes'

import './database'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)

app.listen(3333, () => {
	console.log('Server is running...')
})