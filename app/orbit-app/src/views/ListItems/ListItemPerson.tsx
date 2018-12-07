import * as React from 'react'
import { PersonBit } from '@mcro/models'
import { Avatar } from '../Avatar'
import { Text } from '@mcro/ui'

// TODO basically just use a regular OrbitListItem and make it support this

export const ListItemPerson = ({ model }: { model: PersonBit }) => {
  return (
    <>
      {!!model.photo && <Avatar src={model.photo} />}
      {/* TODO: email is less important than their top topics */}
      {/* But we could have small icons for email/slack */}
      <Text alpha={0.8} ellipse>
        {model.email}
      </Text>
    </>
  )
}

ListItemPerson.itemProps = {
  hide: {
    icon: true,
  },
}
