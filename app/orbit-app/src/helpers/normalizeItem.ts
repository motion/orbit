import * as React from 'react'
import { Person, Bit, PersonBit, IntegrationType } from '@mcro/models'
import { Setting } from '@mcro/models'
import { last } from 'lodash'

export type NormalizedItem = {
  id: string
  type: 'person' | 'bit' | 'source'
  subType?: string
  title: string
  preview?: React.ReactNode
  content?: React.ReactNode
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
  integration?: IntegrationType
  avatar?: string
  afterTitle?: React.ReactNode
  after?: React.ReactNode
}

export type ItemResolverExtraProps = {
  beforeTitle?: React.ReactNode
  minimal?: boolean
  preventSelect?: boolean
}

type ResolvableModel = Bit | Person | PersonBit | Setting

const normalizers = {
  bit: (bit: Bit): NormalizedItem => {
    return {
      type: 'bit',
      id: `${bit.id}`,
      title: bit.title,
      icon: bit.integration,
      webLink: bit.webLink,
      people: bit.people,
      location: bit.location ? bit.location.name : '',
      locationLink:
        bit.desktopLink || bit.webLink || bit.location.desktopLink || bit.location.webLink,
      desktopLink: bit.desktopLink,
      subType: bit.type,
      integration: bit.integration,
      createdAt: new Date(bit.bitCreatedAt),
      updatedAt: new Date(bit.bitUpdatedAt),
    }
  },
  source: (model): NormalizedItem => ({
    type: 'source',
    id: `${model.id}`,
    title: model.type,
    icon: model.type,
  }),
  'person-bit': (person: PersonBit): NormalizedItem => {
    return {
      type: 'person',
      id: person.email,
      title: person.name,
      icon: 'person',
      subtitle: person.email,
      avatar: last(person.allPhotos as any) || person.photo,
      // createdAt: person.createdAt,
      // updatedAt: person.updatedAt,
    }
  },
}

export const normalizeItem = (model: ResolvableModel): NormalizedItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.debug('no normalizer for model', model)
    return model as any
  }
  return normalizers[model.target](model)
}
