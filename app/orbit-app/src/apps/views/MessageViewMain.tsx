import { AppProps, Icon } from '@o/kit'
import { PassProps, Space, SubTitle, Title, View } from '@o/ui'
import React from 'react'

export function MessageViewMain({ title, icon, subType }: AppProps) {
  if (!title) {
    return null
  }
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Title size={title.length > 40 ? 1.4 : 2.2}>{title}</Title>
      {subType && (
        <>
          <SubTitle>{subType}</SubTitle>
        </>
      )}
      <Space small />
      <PassProps size={88}>
        {typeof icon === 'string' ? <Icon name={icon} /> : icon || null}
      </PassProps>
    </View>
  )
}
