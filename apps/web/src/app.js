// @flow
import AppStore from '~/stores/appStore'
import * as Models from '@mcro/models'
import { DB_CONFIG } from '~/constants'

const App = new AppStore({
  config: DB_CONFIG,
  models: Models,
})

window.App = App

export default App

// hmr
if (module && module.hot) {
  module.hot.accept('@mcro/models', () => {
    log('accept: ./app:@mcro/models')
    // log('got hmr for App, not restarting fully to avoid craziness')
    // require('./start').render()
  })

  module.hot.dispose(() => {
    App.dispose()
  })
}
