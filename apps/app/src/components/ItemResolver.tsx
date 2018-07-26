import * as React from 'react'
import { ResolvePerson } from './resolve/ResolvePerson'
import { ResolveBit } from './resolve/ResolveBit'
import { ResolveEmpty } from './resolve/ResolveEmpty'
import { Person, Bit } from '@mcro/models'
import { AppStatePeekItem } from '../../../stores/App'
import { AppStore } from '../stores/AppStore'

export type ResolvedItem = {
  title: string
  preview?: string
  content?: string
  icon: string
  location: string
  locationLink: Function
  permalink: Function
  date: React.ReactNode
  comments?: React.ReactNode[]
  people?: Person[]
  searchTerm?: string
  subtitle?: React.ReactNode
}

export type ItemResolverProps = {
  bit?: Bit
  item?: AppStatePeekItem
  appStore?: AppStore
  isExpanded?: boolean
  children: ((a: ResolvedItem) => React.ReactNode)
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
