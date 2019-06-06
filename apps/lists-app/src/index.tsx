import { createApp } from '@o/kit'

import { ListApp } from './ListsApp'
import { API } from './api.node'

export default createApp({
  id: 'lists',
  name: 'Lists',
  icon: 'list',
  app: ListApp,
  api: () => API,
  viewConfig: {
    acceptsSearch: true,
  },
})
