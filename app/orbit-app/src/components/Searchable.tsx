import * as React from 'react'
import { AppProps } from '../apps/AppProps'
import { Input } from '@mcro/ui'

export function Searchable(props: AppProps & { children: React.ReactNode }) {
  return (
    <>
      <Input onChange={props.appStore.queryStore.onChangeQuery} />
      {props.children}
    </>
  )
}
