import { GetOrbitSource, OrbitSource } from '@mcro/kit'
import { Source } from '@mcro/models'
import { DriveApp } from './DriveApp'
import { driveIcon } from './driveIcon'
import { DriveItem } from './DriveItem'
import { DriveSettings } from './DriveSettings'

export const drive: GetOrbitSource<'drive'> = (source?: Source) => ({
  name: 'Drive',
  modelType: 'bit',
  source: 'drive',
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

export type DriveOrbitApp = OrbitSource<'drive'>
