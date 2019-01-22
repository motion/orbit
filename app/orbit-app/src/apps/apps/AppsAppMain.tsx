import * as React from 'react'
import { Title } from '../../views'
import { Center } from '../../views/Center'
import { AppProps } from '../AppProps'
import { MessageViewMain } from '../views/MessageViewMain'

export default function AppsAppMain({ appConfig }: AppProps<any>) {
  if (!appConfig) {
    return (
      <Center>
        <Title>no item selected</Title>
      </Center>
    )
  }

  const type = appConfig.type as any

  if (type === 'installed') {
    return <MessageViewMain {...appConfig} />
  }

  return <div>{JSON.stringify(appConfig)}</div>
}
