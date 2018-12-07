import * as AllAppActions from '.'
import { setupActions } from '../helpers/setupActions'

export const AppActions = setupActions({
  ...AllAppActions,
})
