import * as React from 'react'
import { AppProps } from '../AppProps'
import { AppType } from '@mcro/models'

export function BitAppIndex(props: AppProps<AppType.bit>) {
  return <>hi {props.id}</>
}
