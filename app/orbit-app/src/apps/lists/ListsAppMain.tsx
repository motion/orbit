import * as React from 'react'
import { AppProps } from '../AppProps'
import { observeMany } from '@mcro/model-bridge'
import { BitModel, Bit } from '@mcro/models'
import { react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { AppSimpleTitleBar } from '../../sources/views/layout/AppSimpleTitleBar'
import { VirtualList } from '../../views/VirtualList/VirtualList'

class ListsMainStore {
  props: AppProps

  // lets fake this list data for now
  list = react(
    () =>
      (observeMany(BitModel, {
        args: {
          take: 10,
        },
      }) as unknown) as any[],
    { defaultValue: [] },
  )
}

export function ListsAppMain(props: AppProps) {
  const store = useStore(ListsMainStore, props)
  return (
    <>
      <AppSimpleTitleBar title="hi lists" />
      <br />
      <br />
      <VirtualList maxHeight={window.innerHeight} items={store.list as Bit[]} />
    </>
  )
}
