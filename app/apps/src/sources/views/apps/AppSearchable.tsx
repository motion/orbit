import { MergeHighlightsContext, Searchable, SearchBarType, SelectionStore } from '@mcro/ui'
import * as React from 'react'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  selectionStore?: SelectionStore
  children: (a: SearchChildProps) => React.ReactNode
}

export const AppSearchable = (props: Props) => {
  return (
    <Searchable
      placeholder="Filter..."
      // focusOnMount
      // onEnter={peekStore.goToNextHighlight}
      // onChange={() => selectionStore.setHighlightIndex(0)}
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
          <MergeHighlightsContext value={{ words: [searchTerm] }}>
            {props.children({ searchBar, searchTerm })}
          </MergeHighlightsContext>
        )
      }}
    </Searchable>
  )
}
