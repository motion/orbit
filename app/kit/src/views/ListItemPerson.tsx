import { Avatar, memoIsEqualDeep, Text } from '@mcro/ui'
import * as React from 'react'
import { Bit } from '@mcro/models'

// TODO basically just use a regular ListItem and make it support this

export const ListItemPerson = memoIsEqualDeep(function ListItemPerson({
  item,
}: {
  item: Bit
}) {
  return (
    <>
      {!!item.photo && (
        <Avatar
          position="absolute"
          top={-12}
          left={-67}
          width={70}
          height={70}
          src={item.photo}
          // style={{
          //   '-webkit-mask-image': `linear-gradient(to bottom, transparent 0%, black 100%)`,
          // }}
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
  paddingLeft: 30,
}
