// @flow
import AppStore from '~/stores/appStore'
import * as Models from '@jot/models'
import { IS_PROD, DB_CONFIG } from '~/constants'

const App = new AppStore({
  database: DB_CONFIG,
  models: Models,
})

export default App

// hmr
if (!IS_PROD) {
  module.hot.accept('@jot/models', () => {
    console.log('got hmr for App, not restarting fully to avoid craziness')
    App.attachModels(require('@jot/models'))
    render()
  })
}
