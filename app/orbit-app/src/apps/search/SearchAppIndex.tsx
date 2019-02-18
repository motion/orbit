import * as React from 'react'
import { useShareMenu } from '../../hooks/useShareMenu'
import { useStores } from '../../hooks/useStores'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppTypes'
import './calendar.css' // theme css file

export default function SearchAppIndex(props: AppProps) {
  const { searchStore } = useStores()
  const items = searchStore.results
  const { getShareMenuItemProps } = useShareMenu()

  return (
    <SelectableList
      minSelected={0}
      items={items}
      query={props.appStore.activeQuery}
      getItemProps={getShareMenuItemProps}
    />
  )
}
