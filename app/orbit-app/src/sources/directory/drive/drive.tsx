import icon from '!raw-loader!../../../../public/icons/drive.svg'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration, OrbitIntegration } from '../../types'
import { DriveApp } from './views/DriveApp'
import { DriveItem } from './views/DriveItem'
import DriveSettings from './views/DriveSettings'

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
