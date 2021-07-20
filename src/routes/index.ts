import express from 'express'

import { usersRouter } from './users.routes'
import { sessionsRouter } from './sessions.routes'
import { profileRouter } from './profile.routes'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const routes = express.Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

routes.use('/profile', ensureAuthenticated, profileRouter)

export { routes }