import * as React from 'react'
import { Title, VerticalSpace } from '../../views'
import { Center } from '../../views/Center'
import { Icon } from '../../views/Icon'

export function MessageViewMain(props) {
  return (
    <Center>
      <Title size={2.5}>{props.title}</Title>
      <VerticalSpace />
      {props.icon ? <Icon name={props.icon} size={64} /> : null}
    </Center>
  )
}
