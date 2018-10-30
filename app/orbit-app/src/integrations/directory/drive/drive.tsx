import { DriveApp } from './views/DriveApp'
import { DriveSources } from './views/DriveSources'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/drive.svg'
import { GetOrbitIntegration, OrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { DriveItem } from './views/DriveItem'

export const drive: GetOrbitIntegration<'drive'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'drive',
  appName: 'Drive',
  defaultQuery: findManyType('drive'),
  display: {
    name: setting.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: DriveApp,
    item: DriveItem,
    setting: DriveSources,
  },
})

export type DriveOrbitApp = OrbitIntegration<'drive'>
