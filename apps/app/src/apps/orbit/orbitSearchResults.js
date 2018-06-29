import * as React from 'react'
import { view, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitQuickSearch } from './OrbitQuickSearch'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'

class SearchStore {
  state = react(
    () => this.props.appStore.searchState,
    state => {
      if (this.props.appStore.selectedPane !== this.props.name) {
        throw react.cancel
      }
      return state
    },
    { immediate: true },
  )

  hasQuery() {
    return !!App.state.query
  }
}

@view.attach('appStore')
@view({
  searchStore: SearchStore,
})
export class OrbitSearchResults extends React.Component {
  render({ searchStore, name }) {
    if (!searchStore.state) {
      return null
    }
    const { query, results, message } = searchStore.state
    const isChanging = App.state.query !== query
    log(`SEARCH ${name} --------------`)
    const highlightWords = searchStore.state.query
      .split(' ')
      .filter(x => x.length > 2)
    return (
      <OrbitDockedPane name="search" extraCondition={searchStore.hasQuery}>
        <contents $$flex>
          <message if={message}>{message}</message>
          <OrbitQuickSearch />
          <results $isChanging={isChanging} if={results.length}>
            {results.map((bit, index) => (
              <OrbitCard
                pane={name}
                subPane="search"
                key={`${index}${bit.identifier || bit.id}`}
                index={index}
                total={results.length}
                bit={bit}
                listItem
                hoverToSelect
              >
                <content>
                  <UI.Text
                    size={1.2}
                    alpha={0.7}
                    ellipse={3}
                    wordBreak="break-all"
                    highlight={
                      highlightWords.length && {
                        words: highlightWords,
                        maxChars: Math.max(400, 3500 / results.length),
                        maxSurroundChars: Math.max(80, 850 / results.length),
                        trimWhitespace: true,
                        separator: '&nbsp;&middot;&nbsp;',
                      }
                    }
                  >
                    {sanitize(bit.body)}
                  </UI.Text>
                </content>
              </OrbitCard>
            ))}
          </results>
          <space css={{ height: 20 }} />
        </contents>
      </OrbitDockedPane>
    )
  }

  static style = {
    orbitSearchResults: {
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    visible: {
      opacity: 1,
      pointerEvents: 'all',
    },
    isChanging: {
      opacity: 0.7,
    },
    message: {
      padding: [5, 10],
      fontSize: 12,
      opacity: 0.3,
    },
    results: {
      opacity: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
    content: {
      padding: [10, 0],
    },
  }
}
