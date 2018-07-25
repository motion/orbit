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
  const avatar = bit.data.profile && bit.data.profile.image_512
  return children({
    id: bit.id,
    title: bit.name,
    type: 'person',
    icon: avatar || 'users_square',
    subtitle: (
      <UI.Text if={bit.data.profile} ellipse>
        {bit.data.profile.email}
      </UI.Text>
    ),
    date: bit.bitUpdatedAt,
    iconProps: {
      color: '#ccc',
    },
    preview: !!avatar && (
      <UI.Col flex={1}>
        <Avatar src={bit.data.profile.image_512} />
      </UI.Col>
    ),
  })
}
