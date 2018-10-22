import { Setting } from '@mcro/models'
import { GetOrbitIntegration } from '../../types'
import { PersonApp } from './PersonApp'
import { PersonItem } from './PersonItem'

export const person: GetOrbitIntegration<'person'> = (_setting?: Setting) => ({
  source: 'person-bit',
  appName: 'Directory',
  defaultQuery: {
    take: 40,
    where: {
      people: {
        bits: {
          $moreThan: 1,
        },
      },
    },
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
