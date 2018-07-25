import * as React from 'react'
import { ResolvePerson } from './resolve/ResolvePerson'
import { ResolveBit } from './resolve/ResolveBit'
import { ResolveEmpty } from './resolve/ResolveEmpty'
import { Person, Bit } from '@mcro/models'
import { SearchStore } from '../stores/SearchStore'
import { AppStatePeekItem } from '../../../stores/App'

export type ItemResolverProps = {
  bit?: Bit
  item?: AppStatePeekItem
  searchStore?: SearchStore
  isExpanded?: boolean
  children: Function | React.ReactNode
  shownLimit?: number
  itemProps?: Object
}

export const ItemResolver = ({ bit, item, ...props }: ItemResolverProps) => {
  let Resolver
  if (bit instanceof Person) {
    Resolver = ResolvePerson
  }
  if (bit instanceof Bit) {
    Resolver = ResolveBit
  }
  if (!Resolver) {
    Resolver = ResolveEmpty
  }
  return <Resolver bit={bit} item={item} {...props} />
}
