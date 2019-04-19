import React from 'react'
import { Searchable } from '../tables/Searchable'
import { View } from '../View/View'
import { List, ListProps } from './List'

export type SearchableListProps = ListProps & {
  belowSearchBar?: React.ReactNode
}

export const SearchableList = ({
  belowSearchBar,
  searchable,
  ...listProps
}: SearchableListProps) => {
  if (searchable === false) {
    return <List {...listProps} />
  }
  return (
    <Searchable>
      {({ searchBar, searchTerm }) => (
        <>
          <View pad={listProps.padInner || 'sm'}>{searchBar}</View>
          {belowSearchBar}
          <List {...listProps} search={searchTerm} />
        </>
      )}
    </Searchable>
  )
}
