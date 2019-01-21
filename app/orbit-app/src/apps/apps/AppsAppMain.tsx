import * as React from 'react'
import { Title } from '../../views'
import { Center } from '../../views/Center'
import { AppProps } from '../AppProps'

export default function AppsAppMain(props: AppProps<any>) {
  if (!props.appConfig) {
    return (
      <Center>
        <Title>no item selected</Title>
      </Center>
    )
  }

  return <div>hi</div>
}
