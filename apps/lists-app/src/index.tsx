import { createApp } from '@o/kit'

import { API } from './api.node'
import { ListApp } from './ListsApp'

export default createApp({
  id: 'lists',
  name: 'Lists',
  icon: 'list',
  iconColors: ['rgb(57, 204, 204)', 'rgb(61, 153, 112)'],
  app: ListApp,
  api: () => API,
  viewConfig: {
    acceptsSearch: true,
  },
})
