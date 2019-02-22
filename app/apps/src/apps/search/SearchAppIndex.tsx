import { AppProps, List, useShareMenu } from '@mcro/kit'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'
import './calendar.css' // theme css file

export default function SearchAppIndex(_: AppProps) {
  // @ts-ignore
  const { searchStore } = useStores()
  const items = searchStore.results
  const { getShareMenuItemProps } = useShareMenu()

  console.log('rendering app index')

  return <List minSelected={0} items={items} getItemProps={getShareMenuItemProps} />
}
