import { Setting } from '@mcro/models'
import { GetOrbitApp } from '../../types'
import { PersonApp } from './PersonApp'
import { PersonItem } from './PersonItem'

export const person: GetOrbitApp<'person'> = (_setting?: Setting) => ({
  source: 'person-bit',
  appName: 'Directory',
  defaultQuery: {
    take: 20,
  },
  display: {
    name: 'Directory',
    icon: 'person',
    itemName: 'person',
  },
  views: {
    main: PersonApp,
    item: PersonItem,
  },
})
