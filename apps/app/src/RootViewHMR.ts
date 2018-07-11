import { RootView } from './RootView'
import { hot } from 'react-hot-loader'

// things that go direct to root should come through here first
// it fixes hmr
import './helpers/installGlobals'
import './router'
import './themes'
import './constants'

export const RootViewHMR = hot(module)(RootView)
