// @flow
import AppStore from '~/stores/appStore'
import * as Models from '@jot/models'
import { DB_CONFIG } from '~/constants'

const App = new AppStore({
  config: DB_CONFIG,
  models: Models,
})

export default App

// hmr
if (module && module.hot) {
  module.hot.accept('@jot/models', async () => {
    console.log('got hmr for App, not restarting fully to avoid craziness')
    await App.attachModels(require('@jot/models'))
    require('./start').render()
  })
}
