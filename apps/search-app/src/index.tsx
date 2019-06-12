import { createApp } from '@o/kit'

import { SearchApp } from './SearchApp'

export default createApp({
  id: 'search',
  name: 'Search',
  icon: 'search',
  app: SearchApp,
  iconColors: ['#386798', '#095647'],
  viewConfig: {
    transparentBackground: true,
  },
})
