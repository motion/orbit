import * as React from 'react'
import { PersonBit } from '@mcro/models'
import { Avatar } from '../Avatar'
import { Text } from '@mcro/ui'

// TODO basically just use a regular ListItem and make it support this

export const ListItemPerson = ({ item }: { item: PersonBit }) => {
  return (
    <>
      {!!item.photo && <Avatar src={item.photo} />}
      {/* TODO: email is less important than their top topics */}
      {/* But we could have small icons for email/slack */}
      <Text alpha={0.8} ellipse>
        {item.email}
      </Text>
    </>
  )
}

ListItemPerson.itemProps = {
  hideIcon: true,
}
