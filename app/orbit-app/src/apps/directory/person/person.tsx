import { Setting, GenericBit } from '@mcro/models'
import { GetOrbitApp, ItemProps } from '../../types'
import { PersonApp } from './PersonApp'
import { PersonItem } from './PersonItem'

export const person: GetOrbitApp<'person'> = (setting?: Setting) => ({
  source: 'person-bit',
  display: {
    name: setting.name,
    icon: 'person',
  },
  views: {
    main: PersonApp,
    item: PersonItem,
  },
})

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
