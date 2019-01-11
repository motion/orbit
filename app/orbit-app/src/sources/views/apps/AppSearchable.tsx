import * as React from 'react'
import { Searchable, SearchBarType } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../../stores/SelectionStore'
import { AppStore } from '../../../apps/AppStore'

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
  const { appStore, children } = props
  return (
    <Searchable
      defaultValue={appStore.props.queryStore.query}
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
            {children({ searchBar, searchTerm })}
          </ProvideHighlightsContextWithDefaults>
        )
      }}
    </Searchable>
  )
}
