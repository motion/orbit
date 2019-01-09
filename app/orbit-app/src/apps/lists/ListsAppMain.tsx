import * as React from 'react'
import { AppProps } from '../AppProps'
import { useObserveMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { VirtualList } from '../../views/VirtualList/VirtualList'

export const ListsAppMain = React.memo((props: AppProps<'lists'>) => {
  const items = useObserveMany(BitModel, {
    take: 10,
  })
  return (
    <>
      <VirtualList
        maxHeight={props.appStore.maxHeight}
        items={items}
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
