import { AppBit, Bit } from '@mcro/models'
import * as React from 'react'
import { NormalItem } from '../types/NormalItem'
import { ResolvableModel } from '../types/ResolvableModel'

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
      createdAt: new Date(bit.bitCreatedAt),
      updatedAt: new Date(bit.bitUpdatedAt),
    }
  },
  app: (app: AppBit): NormalItem => ({
    type: 'app',
    id: `${app.id}`,
    title: app.name,
    icon: app.identifier,
  }),
}

export const normalizeItem = (model: ResolvableModel): NormalItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.debug('no normalizer for model', model)
    return model as any
  }
  return normalizers[model.target](model)
}
