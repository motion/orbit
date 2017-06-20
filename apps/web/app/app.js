// @flow
import AppStore from '~/stores/appStore'
import * as Models from '@jot/models'
import { IS_PROD, DB_CONFIG } from '~/constants'

console.log('got models', Models)

const App = new AppStore({
  database: DB_CONFIG,
  models: Models,
})

export default App

// hmr
if (!IS_PROD) {
  module.hot.accept('@jot/models', async () => {
    console.log('got hmr for App, not restarting fully to avoid craziness')
    await App.attachModels(require('@jot/models'))
    require('./start').render()
  })
}
