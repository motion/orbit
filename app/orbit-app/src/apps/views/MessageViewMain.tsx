import { AppProps, Icon } from '@mcro/kit'
import { Center, PassProps, Title, VerticalSpace } from '@mcro/ui'
import React from 'react'

export function MessageViewMain({ appConfig }: AppProps) {
  const { title, icon } = appConfig
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
