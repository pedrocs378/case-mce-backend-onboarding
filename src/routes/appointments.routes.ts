import express from 'express'

import { AppointmentsController } from '../controllers/AppointmentsController'
import { UserAppointmentsController } from '../controllers/UserAppointmentsController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const appointmentsController = new AppointmentsController()
const userAppointmentsController = new UserAppointmentsController()

const appointmentsRouter = express.Router()

appointmentsRouter.post('/', ensureAuthenticated, appointmentsController.create)
appointmentsRouter.get('/me', ensureAuthenticated, userAppointmentsController.index)

export { appointmentsRouter }