import { RootView as RootViewReal } from './RootView'
import { hot } from 'react-hot-loader'

// things that go direct to root should come through here first
// it fixes hmr
// import './helpers/installDevelopmentHelpers'
import './router'
import './themes'
import './constants'

export const RootView = hot(module)(RootViewReal)
