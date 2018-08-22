import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { ItemResolverProps } from '../ItemResolver'
import { Person } from '@mcro/models'

const Avatar = view('img', {
  borderRadius: 100,
  width: 70,
  height: 70,
  margin: [10, 0],
  position: 'absolute',
  top: -15,
  right: -15,
  transform: {
    scale: 1.4,
    y: -5,
    rotate: '40deg',
  },
})

export const ResolvePerson = ({
  children,
  model,
}: ItemResolverProps & { model: Person }) => {
  if (!model) {
    return null
  }
  return children({
    title: model.name,
    icon: model.photo || 'users_square',
    subtitle: model.email,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    preview: !!model.photo && (
      <UI.Col flex={1}>
        <Avatar src={model.photo} />
      </UI.Col>
    ),
  })
}
