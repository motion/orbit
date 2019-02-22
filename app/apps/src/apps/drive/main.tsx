import { DriveApp } from './DriveApp'
import { driveIcon } from './driveIcon'
import { DriveItem } from './DriveItem'
import { DriveSettings } from './DriveSettings'

export const drive = {
  name: 'Drive',
  modelType: 'bit',
  sourceType: 'drive',
  itemName: 'task',
  icon: driveIcon,
  views: {
    main: DriveApp,
    item: DriveItem,
    setting: DriveSettings,
  },
}
