import express from 'express'

import { AppointmentsController } from '../controllers/AppointmentsController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const appointmentsController = new AppointmentsController()

const providersRouter = express.Router()

providersRouter.get('/', ensureAuthenticated, appointmentsController.create)

export { providersRouter }