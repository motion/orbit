import { AppConfig } from '@mcro/models'
import * as React from 'react'
import { Title, VerticalSpace } from '../../views'
import { Center } from '../../views/Center'
import { Icon } from '../../views/Icon'
import { TextFit } from '../../views/TextFit'

export function MessageViewMain(props: AppConfig) {
  return (
    <Center>
      <Title>
        <TextFit>{props.title}</TextFit>
      </Title>
      <VerticalSpace />
      {props.icon ? <Icon name={props.icon} size={64} /> : null}
    </Center>
  )
}
