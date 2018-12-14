import { createNavigator, SwitchRouter } from '@react-navigation/core'
import { HomePage } from './pages/HomePage'

export const SiteRoot = createNavigator(
  SwitchRouter({
    Home: HomePage,
  }),
  {},
)
