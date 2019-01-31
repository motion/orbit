import { PersonBit } from '@mcro/models'
import { Text } from '@mcro/ui'
import * as React from 'react'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { Avatar } from '../Avatar'

// TODO basically just use a regular ListItem and make it support this

const ListItemPerson = memoIsEqualDeep(function ListItemPerson({ item }: { item: PersonBit }) {
  return (
    <>
      {!!item.photo && (
        <Avatar
          position="absolute"
          top={-15}
          right={-22}
          width={70}
          height={70}
          src={item.photo}
          style={{
            '-webkit-mask-image': `linear-gradient(to bottom, transparent 0%, #eee 100%)`,
          }}
        />
      )}
      {/* TODO: email is less important than their top topics */}
      {/* But we could have small icons for email/slack */}
      <Text alpha={0.8} ellipse>
        {item.email}
      </Text>
    </>
  )
})

ListItemPerson['itemProps'] = {
  hideIcon: true,
}

export default ListItemPerson
