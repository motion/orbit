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

export const ResolvePerson = ({ children, bit }) => {
  if (!bit) {
    return null
  }
  return children({
    id: bit.id,
    title: bit.name,
    type: 'person',
    icon: bit.photo || 'users_square',
    subtitle: !!bit.email,
    date: bit.bitUpdatedAt,
    iconProps: {
      color: '#ccc',
    },
    preview: !!bit.photo && (
      <UI.Col flex={1}>
        <Avatar src={bit.photo} />
      </UI.Col>
    ),
  })
}
