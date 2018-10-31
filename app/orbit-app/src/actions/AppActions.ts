import * as AllAppActions from './appActions'
import { setupActions } from '../helpers/setupActions'

export const AppActions = setupActions({
  ...AllAppActions,
})
