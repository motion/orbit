import { List, useShareMenu } from '@mcro/kit'
import React from 'react'
import { SearchStore } from './SearchStore'

export function SearchAppIndex(props: { searchStore: SearchStore }) {
  const items = props.searchStore.results
  const { getShareMenuItemProps } = useShareMenu()
  return (
    <>
      <List minSelected={0} items={items} getItemProps={getShareMenuItemProps} />
    </>
  )
}
