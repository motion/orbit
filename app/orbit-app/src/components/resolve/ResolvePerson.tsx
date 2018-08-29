import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { ItemResolverProps } from '../ItemResolver'
import { PersonBit } from '../../../../models/src'
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

export const ResolvePerson = ({
  children,
  model,
}: ItemResolverProps & { model: PersonBit }) => {
  if (!model) {
    return null
  }
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
