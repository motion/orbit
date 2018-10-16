import * as React from 'react'
import { Person, Bit, PersonBit } from '@mcro/models'
import { Setting } from '@mcro/models'

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
  integration?: string
}

export type ItemResolverExtraProps = {
  beforeTitle?: React.ReactNode
  minimal?: boolean
  preventSelect?: boolean
}

type ResolvableModel = Bit | Person | PersonBit | Setting

const normalizers = {
  bit: (bit: Bit) => {
    return {
      id: bit.id,
      type: 'bit',
      subType: bit.type,
      integration: bit.integration,
      createdAt: new Date(bit.bitCreatedAt),
      updatedAt: new Date(bit.bitUpdatedAt),
    }
  },
  setting: model => ({
    id: `${model.id}`,
    type: 'app',
    title: model.type,
    icon: model.type,
  }),
  person: (person: PersonBit) => {
    // @ts-ignore TODO why bad
    const photo = last(person.allPhotos) || person.photo
    return {
      id: person.email,
      type: 'person',
      title: person.name,
      icon: photo,
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
  return normalizers[model.target](model)
}
