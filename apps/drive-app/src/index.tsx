import { createApi, createApp } from '@o/kit'

import { graph } from './api.graph.node'
import { DriveApi } from './api.node'
import { driveIcon } from './driveIcon'
import { DriveSettings } from './DriveSettings'

export default createApp({
  id: 'drive',
  name: 'Drive',
  icon: driveIcon,
  itemType: 'task',
  settings: DriveSettings,
  sync: true,
  api: createApi<typeof DriveApi>(),
  graph,
})
