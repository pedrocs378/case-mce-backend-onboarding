import express from 'express'

import { AppointmentsController } from '../controllers/AppointmentsController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const appointmentsController = new AppointmentsController()

const appointmentsRouter = express.Router()

appointmentsRouter.post('/', ensureAuthenticated, appointmentsController.create)
appointmentsRouter.get('/', ensureAuthenticated, appointmentsController.index)

export { appointmentsRouter }