import * as RealRoot from './RootView'
import { hot } from 'react-hot-loader'

// if hmr breaks, try adding the thing thats having trouble here...
// it seems to not like skipping this file for hmr
import './stores/RootStore'
import './router'
import './themes'
import './constants'
import '@mcro/gloss'

// import dev helpers
import './helpers/installDevelopmentHelpers'

export const RootView = hot(module)(RealRoot.RootView)
