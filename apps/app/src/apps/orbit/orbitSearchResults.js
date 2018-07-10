import * as React from 'react'
import { view, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitQuickSearch } from './OrbitQuickSearch'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'

class SearchStore {
  // this isn't a computed val because it persists the last state
  //
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
@view.attach({
  searchStore: SearchStore,
})
@view
export class OrbitSearchResults extends React.Component {
  render({ searchStore, name }) {
    if (!searchStore.state) {
      return null
    }
    const { query, results, message } = searchStore.state
    const isChanging = App.state.query !== query
    log(`SEARCH OrbitSearchResults ${name} --------------`)
    const highlightWords = searchStore.state.query
      .split(' ')
      .filter(x => x.length > 2)
    console.log('OrbitSearchResults', highlightWords, results, query, message)
    return (
      <OrbitDockedPane name="search" extraCondition={searchStore.hasQuery}>
        <contents $$flex>
          <message if={message}>{message}</message>
          <OrbitQuickSearch />
          <results
            if={results.length}
            css={{
              position: 'relative',
              transition: 'opacity ease-in-out 150ms',
              opacity: isChanging ? 0.7 : 1,
            }}
          >
            {results.map((bit, index) => (
              <OrbitCard
                pane={name}
                subPane="search"
                key={`${index}${bit.identifier || bit.id}`}
                index={index}
                total={results.length}
                bit={bit}
                listItem
              >
                <content>
                  <UI.Text
                    size={1.2}
                    alpha={0.7}
                    wordBreak="break-all"
                    highlight={
                      highlightWords.length && {
                        words: highlightWords,
                        maxChars: 380,
                        maxSurroundChars: 120,
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
    message: {
      padding: [5, 10],
      fontSize: 12,
      opacity: 0.3,
    },
    content: {
      padding: [10, 0],
    },
  }
}
