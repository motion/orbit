import { Center, PassProps, Title, VerticalSpace } from '@mcro/ui'
import * as React from 'react'
import { Icon } from '../../views/Icon'
import { AppConfig } from '../AppTypes'

export function MessageViewMain(props: AppConfig) {
  return (
    <Center>
      <Title size={props.title.length > 40 ? 1.4 : 2.2}>{props.title}</Title>
      <VerticalSpace />
      <PassProps size={88}>
        {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon || null}
      </PassProps>
    </Center>
  )
}
