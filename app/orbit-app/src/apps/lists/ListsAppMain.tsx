import { useObserveMany } from '@mcro/model-bridge'
import { AppType, BitModel } from '@mcro/models'
import * as React from 'react'
import { Title } from '../../views'
import VirtualList from '../../views/VirtualList/VirtualList'
import { AppProps } from '../AppProps'

export const ListsAppMain = React.memo(function ListsAppMain(props: AppProps<AppType.lists>) {
  const items = useObserveMany(BitModel, {
    where: {},
    take: 10,
  })
  return (
    <>
      <Title>{props.appConfig && props.appConfig.title}</Title>
      <VirtualList
        maxHeight={props.appStore.maxHeight}
        items={items}
        itemProps={{
          hideBody: true,
          hideSubtitle: true,
        }}
      />
    </>
  )
})
