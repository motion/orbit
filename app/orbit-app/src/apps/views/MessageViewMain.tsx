import { AppProps, Icon } from '@o/kit'
import { Center, PassProps, Title, VerticalSpace } from '@o/ui'
import React from 'react'

export function MessageViewMain({ appConfig }: AppProps) {
  const { title, icon } = appConfig
  if (!title) {
    return null
  }
  return (
    <Center>
      <Title size={title.length > 40 ? 1.4 : 2.2}>{title}</Title>
      <VerticalSpace />
      <PassProps size={88}>
        {typeof icon === 'string' ? <Icon name={icon} /> : icon || null}
      </PassProps>
    </Center>
  )
}
