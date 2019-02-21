import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import * as React from 'react'
import { PersonItem } from './PersonItem'

export const person: GetOrbitIntegration<'person'> = (_source?: Source) => ({
  modelType: 'person-bit',
  appName: 'People',
  defaultQuery: {
    take: 30,
  },
  display: {
    name: 'Directory',
    icon: 'person',
    itemName: 'person',
  },
  views: {
    main: () => <div>no people!</div>,
    item: PersonItem,
  },
})
