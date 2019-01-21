import * as React from 'react'
import { AppProps } from '../AppProps'

export default function AppsAppMain(props: AppProps<any>) {
  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  return <div>hi</div>
}
