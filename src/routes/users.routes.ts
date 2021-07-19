import express from 'express'

import { PersonalController } from '../controllers/PersonalController'
import { UsersController } from '../controllers/UsersController'

const usersController = new UsersController()
const personalController = new PersonalController()

const usersRouter = express.Router()

usersRouter.post('/user', usersController.create)
usersRouter.post('/personal', personalController.create)

export { usersRouter }