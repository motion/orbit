import * as AllAppActions from './appActionsHandlers'
import { setupActions } from '../helpers/setupActions'

export const AppActions = setupActions({
  ...AllAppActions,
})
