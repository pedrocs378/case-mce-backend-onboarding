import express from 'express'

import { ForgotPasswordController } from '../controllers/ForgotPasswordController'

const forgotPasswordController = new ForgotPasswordController()

const passwordRouter = express.Router()

passwordRouter.post('/forgot', forgotPasswordController.create)
// passwordRouter.post('/reset', notificationsController.update)

export { passwordRouter }