import { GetOrbitIntegration, OrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { driveIcon } from './driveIcon'
import { DriveApp } from './views/DriveApp'
import { DriveItem } from './views/DriveItem'
import { DriveSettings } from './views/DriveSettings'

export const drive: GetOrbitIntegration<'drive'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'drive',
  appName: 'Drive',
  defaultQuery: findManyType('drive'),
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
