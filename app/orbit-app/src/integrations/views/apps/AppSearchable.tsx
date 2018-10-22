import * as React from 'react'
import { Searchable, SearchBarType } from '@mcro/ui'
import { view } from '@mcro/black'
import { AppStore } from '../../../pages/AppPage/AppStore'
import { App } from '@mcro/stores'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../../pages/OrbitPage/orbitDocked/SelectionStore'

type SearchChildProps = {
  searchBar: SearchBarType
  searchTerm: string
}

type Props = {
  appStore?: AppStore
  selectionStore?: SelectionStore
  children?: (a: SearchChildProps) => React.ReactNode
}

@view.attach('selectionStore', 'appStore')
@view
export class AppSearchable extends React.Component<Props> {
  render() {
    const { selectionStore, appStore, children } = this.props
    const { appConfig } = appStore.state
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
