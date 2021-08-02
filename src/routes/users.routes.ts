import express from 'express'
import multer from 'multer'

import { uploadConfig } from '../config/multer'

import { PersonalController } from '../controllers/PersonalController'
import { UserAvatarController } from '../controllers/UserAvatarController'
import { UsersController } from '../controllers/UsersController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const usersController = new UsersController()
const personalController = new PersonalController()
const userAvatarController = new UserAvatarController()

const upload = multer(uploadConfig.multer)

const usersRouter = express.Router()

usersRouter.post('/user', usersController.create)
usersRouter.post('/personal', personalController.create)

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update)

export { usersRouter }