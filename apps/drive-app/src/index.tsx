import { createApi, createApp } from '@o/kit'
import { driveIcon } from './driveIcon'
import { DriveSettings } from './DriveSettings'
import { DriveApi } from './api.node'

export default createApp({
  id: 'drive',
  name: 'Drive',
  icon: driveIcon,
  itemType: 'task',
  settings: DriveSettings,
  sync: {},
  api: createApi<typeof DriveApi>(),
})
