import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from './OrbitCard'
import { OrbitDockedPane } from './OrbitDockedPane'
// import { OrbitQuickSearch } from './OrbitQuickSearch'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { AppStore } from '../../stores/AppStore'
import { trace } from 'mobx'
import { OrbitSearchStore } from './OrbitSearchStore'

const OrbitSearchResultsInner = view(({ name, appStore, searchStore }) => {
  const { query, results, message } = searchStore.state
  const isChanging = searchStore.currentQuery !== query
  const highlightWords = searchStore.state.query
    .split(' ')
    .filter(x => x.length > 2)
  log(`.Inner ${isChanging}`)
  trace()
  return (
    <UI.Col flex={1} padding={[10, 0]}>
      <div if={message}>{message}</div>
      <OrbitSearchFilters appStore={appStore} searchStore={searchStore} />
      <div
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
            debug={index === 0}
            nextUpStyle={
              index === 0 && {
                background: [0, 0, 0, 0.025],
              }
            }
          >
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
                highlightWords.length
                  ? bit.body
                  : (bit.body || '').slice(0, 200),
              )}
            </UI.Text>
          </OrbitCard>
        ))}
      </div>
      <div style={{ height: 20 }} />
    </UI.Col>
  )
})

type Props = {
  searchStore: OrbitSearchStore
  appStore: AppStore
  name?: string
}

@view.attach('appStore')
@view.attach({
  searchStore: OrbitSearchStore,
})
@view
export class OrbitSearchResults extends React.Component<Props> {
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
      <OrbitDockedPane
        paddingLeft={0}
        paddingRight={0}
        name="search"
        extraCondition={searchStore}
      >
        <OrbitSearchResultsInner
          appStore={appStore}
          searchStore={searchStore}
          name={name}
        />
      </OrbitDockedPane>
    )
  }
}
