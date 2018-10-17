import { Setting, GenericBit } from '@mcro/models'
import { GetOrbitApp, ItemProps } from '../../types'
import { PersonApp } from './PersonApp'

export const person: GetOrbitApp<'person'> = (setting?: Setting) => ({
  source: 'person-bit',
  display: {
    name: setting.name,
    icon: setting,
  },
  views: {
    main: PersonApp,
    item: PersonItem,
  },
})

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
