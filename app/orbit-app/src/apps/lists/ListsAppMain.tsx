import * as React from 'react'
import { AppProps } from '../AppProps'
import { observeMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { AppSimpleTitleBar } from '../../sources/views/layout/AppSimpleTitleBar'

class ListsMainStore {
  props: AppProps

  // lets fake this list data for now
  list = react(() =>
    observeMany(BitModel, {
      args: {
        take: 10,
      },
    }),
  )
}

export function ListsAppMain(props: AppProps) {
  const store = useStore(ListsMainStore, props)
  return (
    <>
      <AppSimpleTitleBar normalizedItem={{ title: 'hi lists' }} />
      hi
      <br />
      <br />
      list: {JSON.stringify(store.list)}
      <br />
      <br />
      props: {JSON.stringify(props)}
    </>
  )
}
