import express from 'express'

import { ProfileController } from '../controllers/ProfileController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const profileController = new ProfileController()

const profileRouter = express.Router()

profileRouter.put('/', ensureAuthenticated, profileController.update)

export { profileRouter }