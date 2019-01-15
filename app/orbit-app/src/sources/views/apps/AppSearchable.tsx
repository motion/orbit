import * as React from 'react'
import { Searchable, SearchBarType } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../../stores/SelectionStore'
import { AppStore } from '../../../apps/AppStore'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  appStore: AppStore<any>
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
        padding: [3, 0],
      }}
    >
      {({ searchBar, searchTerm }) => {
        return (
          // dont searchTerm by spaces, its used for searching the whole term here
          <ProvideHighlightsContextWithDefaults value={{ words: [searchTerm] }}>
            {props.children({ searchBar, searchTerm })}
          </ProvideHighlightsContextWithDefaults>
        )
      }}
    </Searchable>
  )
}
