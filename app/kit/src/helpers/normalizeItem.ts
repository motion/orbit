import { AppBit, Bit } from '@o/models'
import * as React from 'react'
import { NormalItem } from '../types/NormalItem'

export type ItemResolverExtraProps = {
  beforeTitle?: React.ReactNode
  minimal?: boolean
  preventSelect?: boolean
}

const normalizers = {
  bit: (bit: Bit): NormalItem => {
    return {
      type: 'bit',
      id: `${bit.id}`,
      title: bit.title,
      icon: bit.appIdentifier,
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
  app: (app: AppBit): NormalItem => ({
    type: 'app',
    id: `${app.id}`,
    title: app.name,
    icon: app.identifier,
  }),
}

export const normalizeItem = (model: Bit | AppBit): NormalItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.debug('no normalizer for model', model)
    return model as any
  }
  return (normalizers[model.target] as any)(model)
}
