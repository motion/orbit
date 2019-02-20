import { GetOrbitIntegration, OrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
// @ts-ignore
import icon from './drive.svg'
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
    icon,
  },
  views: {
    main: DriveApp,
    item: DriveItem,
    setting: DriveSettings,
  },
})

export type DriveOrbitApp = OrbitIntegration<'drive'>
