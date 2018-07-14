import * as React from 'react'
import { view, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { OrbitCard } from './OrbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
// import { OrbitQuickSearch } from './OrbitQuickSearch'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { stateOnlyWhenActive } from './stateOnlyWhenActive'
import { OrbitSearchFilters } from './OrbitSearchFilters'

const OrbitSearchResultsInner = view(({ name, appStore, searchStore }) => {
  const { query, results, message } = searchStore.state
  const isChanging = searchStore.currentQuery !== query
  const highlightWords = searchStore.state.query
    .split(' ')
    .filter(x => x.length > 2)
  return (
    <UI.Col flex={1} padding={[10, 0]}>
      <message if={message}>{message}</message>
      <OrbitSearchFilters appStore={appStore} searchStore={searchStore} />
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
                {sanitize(
                  highlightWords.length ? bit.body : bit.body.slice(0, 200),
                )}
              </UI.Text>
            </content>
          </OrbitCard>
        ))}
      </results>
      <space css={{ height: 20 }} />
    </UI.Col>
  )
})

class SearchStore {
  // this isn't a computed val because it persists the last state
  state = stateOnlyWhenActive(this)

  get isActive() {
    return this.props.appStore.selectedPane === this.props.name
  }

  hasQuery() {
    return !!App.state.query
  }

  // delay just a tiny bit to prevent input delay
  currentQuery = react(() => App.state.query, _ => _, { delay: 32 })
}

@view.attach('appStore')
@view.attach({
  searchStore: SearchStore,
})
@view
export class OrbitSearchResults extends React.Component {
  render() {
    const { appStore, searchStore, name } = this.props
    if (!searchStore.state.results) {
      return null
    }
    log(
      `SEARCH OrbitSearchResults ${name} ${searchStore.hasQuery()} ${
        searchStore.currentQuery
      } --------------`,
    )
    return (
      <OrbitDockedPane name="search" extraCondition={searchStore}>
        <OrbitSearchResultsInner
          appStore={appStore}
          searchStore={searchStore}
          name={name}
        />
      </OrbitDockedPane>
    )
  }
}
