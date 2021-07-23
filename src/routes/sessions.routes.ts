import express from 'express'

import { SessionsController } from '../controllers/SessionsControler'

const sessionsController = new SessionsController()

const sessionsRouter = express.Router()

sessionsRouter.post('/:user_type', sessionsController.create)

export { sessionsRouter }