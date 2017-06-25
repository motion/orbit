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
  module.hot.accept('@jot/models', () => {
    console.log('got hmr for App, not restarting fully to avoid craziness')
    require('./start').render()
  })
}
