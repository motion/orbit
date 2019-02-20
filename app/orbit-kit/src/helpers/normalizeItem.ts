import { Bit, PersonBit, Source } from '@mcro/models'
import { last } from 'lodash'
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
  source: (source: Source): NormalItem => ({
    type: 'source',
    id: `${source.id}`,
    title: source.type,
    icon: source.type,
  }),
  'person-bit': (person: PersonBit): NormalItem => {
    return {
      type: 'person',
      id: person.email,
      title: person.name,
      icon: 'person',
      subtitle: person.email,
      image: last(person.allPhotos as any) || person.photo,
      // createdAt: person.createdAt,
      // updatedAt: person.updatedAt,
    }
  },
}

export const normalizeItem = (model: ResolvableModel): NormalItem => {
  if (!model) {
    throw new Error('Called normalize without a model')
  }
  if (!normalizers[model.target]) {
    console.debug('no normalizer for model', model)
    return model as any
  }
  const normalizer = normalizers[model.target]
  // TODO
  // @ts-ignore
  return normalizer(model)
}
