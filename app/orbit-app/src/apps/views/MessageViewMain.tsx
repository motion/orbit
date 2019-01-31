import { AppConfig } from '@mcro/models'
import { PassProps } from '@mcro/ui'
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
      <PassProps size={64}>
        {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon || null}
      </PassProps>
    </Center>
  )
}
