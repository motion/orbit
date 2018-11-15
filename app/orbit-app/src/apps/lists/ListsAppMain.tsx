import * as React from 'react'
import { AppProps } from '../AppProps'
import { observeMany } from '@mcro/model-bridge'
import { BitModel, Bit } from '@mcro/models'
import { react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { VirtualList } from '../../views/VirtualList/VirtualList'

class ListsMainStore {
  props: AppProps

  get maxHeight() {
    return this.props.appStore.maxHeight
  }

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

export const ListsAppMain = React.memo((props: AppProps) => {
  const store = useStore(ListsMainStore, props)
  return (
    <>
      <VirtualList
        maxHeight={store.maxHeight}
        items={store.list as Bit[]}
        itemProps={{
          hide: {
            body: true,
            subtitle: true,
          },
        }}
      />
    </>
  )
})
