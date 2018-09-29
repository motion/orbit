import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { ItemResolverResolverProps } from '../ItemResolver'
import { PersonBit } from '@mcro/models'
import { last } from 'lodash'

const Avatar = view('img', {
  borderRadius: 100,
  width: 70,
  height: 70,
  margin: [10, 0],
  position: 'absolute',
  top: -22,
  right: -22,
  transform: {
    scale: 1,
    rotate: '40deg',
  },
})

export const ResolvePerson = ({ children, model }: ItemResolverResolverProps<PersonBit>) => {
  if (!model) {
    return null
  }
  // @ts-ignore TODO why bad
  const photo = last(model.allPhotos) || model.photo
  return children({
    id: model.email,
    type: 'person',
    title: model.name,
    icon: photo,
    subtitle: model.email,
    // createdAt: model.createdAt,
    // updatedAt: model.updatedAt,
    preview: !!photo && (
      <UI.Col flex={1}>
        <Avatar src={photo} />
      </UI.Col>
    ),
  })
}
