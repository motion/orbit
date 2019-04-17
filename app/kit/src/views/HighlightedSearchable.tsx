import { HighlightProvide, Searchable, SearchBarType } from '@o/ui'
import * as React from 'react'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  children: (a: SearchChildProps) => React.ReactNode
}

export const HighlightedSearchable = (props: Props) => {
  return (
    <Searchable
      placeholder="Filter..."
      // focusOnMount
      // onEnter={peekStore.goToNextHighlight}
      searchInputProps={{
        background: 'transaprent',
      }}
      searchBarProps={{
        minWidth: 120,
      }}
    >
      {({ searchBar, searchTerm }) => {
        return (
          // dont searchTerm by spaces, its used for searching the whole term here
          <HighlightProvide value={{ words: [searchTerm] }}>
            {props.children({ searchBar, searchTerm })}
          </HighlightProvide>
        )
      }}
    </Searchable>
  )
}
