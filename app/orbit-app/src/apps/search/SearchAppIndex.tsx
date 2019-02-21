import { List } from '@mcro/kit'
import * as React from 'react'
import { useShareMenu } from '../../hooks/useShareMenu'
import { useStores } from '../../hooks/useStores'
import { AppProps } from '../AppTypes'
import './calendar.css' // theme css file

export default function SearchAppIndex(_: AppProps) {
  const { searchStore } = useStores()
  const items = searchStore.results
  const { getShareMenuItemProps } = useShareMenu()

  return <List minSelected={0} items={items} getItemProps={getShareMenuItemProps} />
}
