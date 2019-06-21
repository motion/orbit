import * as React from 'react'

import { Bit } from './BitLike'
import { Config } from './configureUI'

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
  children?: any
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
      subTitle: bit.body,
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
}

export const normalizeItem = (model: Bit): NormalItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.warn('no normalizer for model', model)
    return {}
  }
  return normalizers[model.target](model)
}
