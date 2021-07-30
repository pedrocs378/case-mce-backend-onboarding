import express from 'express'

import { ProvidersController } from '../controllers/ProvidersController'
import { ProviderAvailableHoursController } from '../controllers/ProviderAvailableHoursController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const providersController = new ProvidersController()
const providerAvailableHoursController = new ProviderAvailableHoursController()

const providersRouter = express.Router()

providersRouter.get('/', ensureAuthenticated, providersController.index)
providersRouter.get('/:provider_id', ensureAuthenticated, providersController.show)

providersRouter.get(
	'/:provider_id/available_day_hours', 
	ensureAuthenticated, 
	providerAvailableHoursController.index
)

export { providersRouter }