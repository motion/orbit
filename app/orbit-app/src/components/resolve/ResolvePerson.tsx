import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'

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

export const ResolvePerson = ({ children, model }) => {
  if (!model) {
    return null
  }
  return children({
    id: model.id,
    title: model.name,
    type: 'person',
    icon: model.photo || 'users_square',
    subtitle: !!model.email,
    date: model.updatedAt,
    iconProps: {
      color: '#ccc',
    },
    preview: !!model.photo && (
      <UI.Col flex={1}>
        <Avatar src={model.photo} />
      </UI.Col>
    ),
  })
}
