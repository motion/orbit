import { DriveApp } from './views/DriveApp'
import { DriveSettings } from './views/DriveSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/drive.svg'
import { GetOrbitApp, OrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { DriveItem } from './views/DriveItem'

export const drive: GetOrbitApp<'drive'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'drive',
  integrationName: 'Drive',
  defaultQuery: findManyType('drive'),
  display: {
    name: setting.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: DriveApp,
    item: DriveItem,
    setting: DriveSettings,
  },
})

export type DriveOrbitApp = OrbitApp<'drive'>
