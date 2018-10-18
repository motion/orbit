import { Setting } from '@mcro/models'
import { GetOrbitApp } from '../../types'
import { PersonApp } from './PersonApp'
import { PersonItem } from './PersonItem'

export const person: GetOrbitApp<'person'> = (setting?: Setting) => ({
  source: 'person-bit',
  defaultQuery: {
    take: 20,
  },
  display: {
    name: setting.name,
    icon: 'person',
  },
  views: {
    main: PersonApp,
    item: PersonItem,
  },
})
