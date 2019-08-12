import { createApp } from '@o/kit'

import { GraphExplorer } from '../views/GraphExplorer'

export default createApp({
  id: 'graph',
  name: 'Graph',
  icon: 'graph',
  app: GraphExplorer,
})
