import express from 'express'

import { ForgotPasswordController } from '../controllers/ForgotPasswordController'
import { ValidateTokenController } from '../controllers/ValidateTokenController'
import { ResetPasswordController } from '../controllers/ResetPasswordController'

const forgotPasswordController = new ForgotPasswordController()
const validateTokenController = new ValidateTokenController()
const resetPasswordController = new ResetPasswordController()

const passwordRouter = express.Router()

passwordRouter.post('/forgot', forgotPasswordController.create)
passwordRouter.post('/validate_token', validateTokenController.create)
passwordRouter.post('/reset', resetPasswordController.update)

export { passwordRouter }