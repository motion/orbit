import { createApp } from '@mcro/kit'
import { driveIcon } from './driveIcon'
import { DriveSettings } from './DriveSettings'

export default createApp({
  id: 'drive',
  name: 'Drive',
  icon: driveIcon,
  itemType: 'task',
  settings: DriveSettings,
  sync: {},
})
