import express from 'express'

import { NotificationsController } from '../controllers/NotificationsController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const notificationsController = new NotificationsController()

const notificationsRouter = express.Router()

notificationsRouter.get('/', ensureAuthenticated, notificationsController.index)
notificationsRouter.patch('/:notification_id', ensureAuthenticated, notificationsController.update)

export { notificationsRouter }