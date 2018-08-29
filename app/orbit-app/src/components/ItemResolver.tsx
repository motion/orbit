import * as React from 'react'
import { ResolvePerson } from './resolve/ResolvePerson'
import { ResolveBit } from './resolve/ResolveBit'
import { ResolveEmpty } from './resolve/ResolveEmpty'
import { Person, Bit, PersonBit } from '@mcro/models'
import { AppStore } from '../stores/AppStore'
import { ItemHideProps } from '../types/ItemHideProps'
import { Setting } from '../../../models/src'

export type ResolvedItem = {
  id: string
  type: 'person' | 'bit'
  title: string
  preview?: React.ReactNode
  content?: string
  icon: string
  location?: string
  locationLink?: string
  webLink?: string
  desktopLink?: string
  createdAt?: Date
  updatedAt?: Date
  comments?: React.ReactNode[]
  people?: Person[]
  searchTerm?: string
  subtitle?: React.ReactNode
  integration?: string
}

export type ItemResolverProps = {
  model?: Bit | Person | PersonBit | Setting
  appStore?: AppStore
  isExpanded?: boolean
  children: ((a: ResolvedItem) => React.ReactNode)
  shownLimit?: number
  itemProps?: Object
  searchTerm?: string
  hide?: ItemHideProps
  onResolvedItem?: (a: ResolvedItem) => any
}

export const ItemResolver = ({
  model,
  onResolvedItem,
  children,
  ...props
}: ItemResolverProps) => {
  let Resolver
  if (!model) {
    return null
  }
  if (model.target === 'person' || model.target === 'person-bit') {
    Resolver = ResolvePerson
  }
  if (model.target === 'bit') {
    Resolver = ResolveBit
  }
  if (!Resolver) {
    Resolver = ResolveEmpty
  }
  return (
    <Resolver model={model} {...props}>
      {item => {
        // allow getting the item via a prop other than children intended for side effects
        if (onResolvedItem) {
          onResolvedItem(item)
        }
        return children(item)
      }}
    </Resolver>
  )
}
