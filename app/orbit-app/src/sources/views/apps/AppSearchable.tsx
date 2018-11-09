import * as React from 'react'
import { Searchable, SearchBarType } from '@mcro/ui'
import { view, attach } from '@mcro/black'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'
import { App } from '@mcro/stores'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../../stores/SelectionStore'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  // TODO: should just be appStore
  appPageStore?: AppPageStore
  selectionStore?: SelectionStore
  children?: (a: SearchChildProps) => React.ReactNode
}

@attach('selectionStore', 'appPageStore')
@view
export class AppSearchable extends React.Component<Props> {
  render() {
    const { selectionStore, appPageStore, children } = this.props
    const { appConfig } = appPageStore.state
    return (
      <Searchable
        key={appConfig.id}
        defaultValue={App.state.query}
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
