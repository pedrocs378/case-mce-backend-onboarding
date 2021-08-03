import express from 'express'

import { usersRouter } from './users.routes'
import { sessionsRouter } from './sessions.routes'
import { profileRouter } from './profile.routes'
import { appointmentsRouter } from './appointments.routes'
import { providersRouter } from './providers.routes'
import { notificationsRouter } from './notifications.routes'
import { passwordRouter } from './password.routes'

const routes = express.Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

routes.use('/profile', profileRouter)
routes.use('/appointments', appointmentsRouter)
routes.use('/providers', providersRouter)

routes.use('/notifications', notificationsRouter)

routes.use('/password', passwordRouter)

export { routes }