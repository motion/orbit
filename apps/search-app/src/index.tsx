import { createApp } from '@o/kit'

import { SearchApp } from './SearchApp'

export default createApp({
  id: 'search',
  name: 'Search',
  icon: 'search',
  app: SearchApp,
  // setup: {
  //   date: {
  //     name: 'Date',
  //     type: 'date',
  //   },
  // },
  viewConfig: {
    transparentBackground: true,
  },
})
