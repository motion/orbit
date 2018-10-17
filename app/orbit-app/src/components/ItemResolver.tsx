import * as React from 'react'
import { Person, Bit, PersonBit, IntegrationType } from '@mcro/models'
import { Setting } from '@mcro/models'
import { last } from 'lodash'

export type NormalizedItem = {
  id: string
  type: 'person' | 'bit' | 'app'
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
      location: bit.location.name,
      locationLink: bit.location.desktopLink || bit.location.webLink,
      desktopLink: bit.desktopLink,
      subType: bit.type,
      integration: bit.integration,
      createdAt: new Date(bit.bitCreatedAt),
      updatedAt: new Date(bit.bitUpdatedAt),
    }
  },
  setting: (model): NormalizedItem => ({
    type: 'app',
    id: `${model.id}`,
    title: model.type,
    icon: model.type,
  }),
  'person-bit': (person: PersonBit): NormalizedItem => {
    return {
      type: 'person',
      id: person.email,
      title: person.name,
      icon: last(person.allPhotos as any) || person.photo,
      subtitle: person.email,
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
    console.log('error with model', model)
    return {}
  }
  return normalizers[model.target](model)
}
