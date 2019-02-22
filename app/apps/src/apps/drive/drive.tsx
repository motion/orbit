import { GetOrbitIntegration, OrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { DriveApp } from './DriveApp'
import { driveIcon } from './driveIcon'
import { DriveItem } from './DriveItem'
import { DriveSettings } from './DriveSettings'

export const drive: GetOrbitIntegration<'drive'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'drive',
  appName: 'Drive',
  display: {
    name: source.name,
    itemName: 'task',
    icon: driveIcon,
  },
  views: {
    main: DriveApp,
    item: DriveItem,
    setting: DriveSettings,
  },
})

export type DriveOrbitApp = OrbitIntegration<'drive'>
