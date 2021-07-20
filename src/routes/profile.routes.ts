import express from 'express'

import { ProfileController } from '../controllers/ProfileController'

const profileController = new ProfileController()

const profileRouter = express.Router()

profileRouter.put('/', profileController.update)

export { profileRouter }