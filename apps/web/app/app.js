// @flow
import AppStore from '~/stores/appStore'
import * as Models from '@jot/models'
import { IS_PROD, DB_CONFIG } from '~/constants'

const App = new AppStore({
  config: DB_CONFIG,
  models: Models,
})

export default App
