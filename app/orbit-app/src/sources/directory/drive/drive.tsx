import { DriveApp } from './views/DriveApp'
import DriveSettings from './views/DriveSettings'
import { Source } from '@mcro/models'
import icon from '../../../../public/icons/drive.svg'
import { GetOrbitIntegration, OrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { DriveItem } from './views/DriveItem'

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
