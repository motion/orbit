import { AppDefinition } from '@mcro/kit'
import { driveIcon } from './driveIcon'
import { DriveSettings } from './DriveSettings'

export const DriveApp: AppDefinition = {
  id: 'drive',
  name: 'Drive',
  icon: driveIcon,
  itemType: 'task',
  settings: DriveSettings,
  sync: {},
}
