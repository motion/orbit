import { setupActions } from '../helpers/setupActions'
import * as AllAppActions from './allAppActions'

export const AppActions = setupActions({
  ...AllAppActions,
})
