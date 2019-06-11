import { createApp } from '@o/kit'
import SearchApp from '@o/search-app'

export default createApp({
  id: 'home',
  icon: 'home',
  name: 'Home',
  app: SearchApp.app,
})
