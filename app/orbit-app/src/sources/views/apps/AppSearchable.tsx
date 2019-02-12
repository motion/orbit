import { Searchable, SearchBarType } from '@mcro/ui'
import * as React from 'react'
import { AppStore } from '../../../apps/AppStore'
import { MergeHighlightsContext } from '../../../helpers/contexts/HighlightsContext'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { SelectionStore } from '../../../stores/SelectionStore'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  appStore: AppStore
  selectionStore?: SelectionStore
  children: (a: SearchChildProps) => React.ReactNode
}

export const AppSearchable = (props: Props) => {
  const { queryStore } = useStoresSafe()
  return (
    <Searchable
      defaultValue={queryStore ? queryStore.query : ''}
      placeholder="Filter..."
      // focusOnMount
      // onEnter={peekStore.goToNextHighlight}
      // onChange={() => selectionStore.setHighlightIndex(0)}
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
