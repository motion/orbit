import * as React from 'react'
import { Source } from '@mcro/models'
import { GetOrbitIntegration } from '../../types'
import { PersonItem } from './PersonItem'

export const person: GetOrbitIntegration<'person'> = (_source?: Source) => ({
  modelType: 'person-bit',
  appName: 'People',
  defaultQuery: {
    take: 30,
    // todo: this causes big performance issues. We need to re-implement it later (store bits counter in the PersonBit entity)
    // where: {
    //   people: {
    //     bits: {
    //       $moreThan: 3,
    //     },
    //   },
    // },
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
