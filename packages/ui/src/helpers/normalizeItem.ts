import * as React from 'react'

import { Bit } from './BitLike'
import { Config } from './configureUI'

// we have a concept of a "bit", which we can use in various UI items automatically
// this helper just noramlizes the bit into something standard, and could be extended.

// TODO cleanup
export type AppBitLike = { target: 'app-bit' } & any

export type ItemResolverExtraProps = {
  beforeTitle?: React.ReactNode
  minimal?: boolean
  preventSelect?: boolean
}

export type NormalItem = {
  id?: string
  icon?: React.ReactNode
  title?: string
  type?: string
  subType?: string
  identifier?: string
  preview?: React.ReactNode
  content?: any
  location?: string
  locationLink?: string
  webLink?: string
  desktopLink?: string
  createdAt?: Date
  updatedAt?: Date
  comments?: React.ReactNode[]
  people?: Bit[]
  searchTerm?: string
  subTitle?: React.ReactNode
  image?: string
  afterTitle?: React.ReactNode
  after?: React.ReactNode
}

const normalizers = {
  bit: (bit: Bit): NormalItem => {
    return {
      type: 'bit',
      id: `${bit.id}`,
      title: bit.title,
      icon: Config.getIconForBit(bit),
      webLink: bit.webLink,
      people: bit.people,
      location: bit.location ? bit.location.name : '',
      locationLink:
        bit.desktopLink || bit.webLink || bit.location.desktopLink || bit.location.webLink,
      desktopLink: bit.desktopLink,
      subType: bit.type,
      createdAt: new Date(bit.bitCreatedAt || bit.createdAt),
      updatedAt: new Date(bit.bitUpdatedAt || bit.updatedAt),
    }
  },
  app: (app: AppBitLike): NormalItem => ({
    type: 'app',
    id: `${app.id}`,
    title: app.name,
    icon: app.identifier,
  }),
}

export const normalizeItem = (model: Bit | AppBitLike): NormalItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.debug('no normalizer for model', model)
    return model as any
  }
  return (normalizers[model.target] as any)(model)
}
