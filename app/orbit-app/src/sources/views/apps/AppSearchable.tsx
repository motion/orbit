import * as React from 'react'
import { Searchable, SearchBarType } from '@mcro/ui'
import { view, attach } from '@mcro/black'
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
  children?: (a: SearchChildProps) => React.ReactNode
}

@attach('selectionStore', 'appPageStore')
@view
export class AppSearchable extends React.Component<Props> {
  render() {
    const { selectionStore, appStore, children } = this.props
    return (
      <Searchable
        defaultValue={appStore.props.queryStore.query}
        // focusOnMount
        // onEnter={peekStore.goToNextHighlight}
        onChange={() => selectionStore.setHighlightIndex(0)}
        width={150}
        searchBarProps={{
          flex: 1,
          // 1px more for inset shadow
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
}
