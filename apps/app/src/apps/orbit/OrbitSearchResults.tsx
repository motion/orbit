import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from './OrbitCard'
import { OrbitDockedPane } from './OrbitDockedPane'
import { OrbitSearchQuickResults } from './orbitSearch/OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { AppStore } from '../../stores/AppStore'
import { OrbitSearchStore } from './OrbitSearchStore'
import { OrbitSearchFilters } from './OrbitSearchFilters'

const OrbitSearchResultsList = view(({ name, searchStore }) => {
  const { results, query } = searchStore.state
  log(`RENDER SENSITIVE`)
  if (!results.length) {
    return null
  }
  const highlightWords = query.split(' ').filter(x => x.length > 2)
  return results.map((bit, index) => (
    <OrbitCard
      pane={name}
      subPane="search"
      key={`${index}${bit.identifier || bit.id}`}
      index={index}
      total={results.length}
      bit={bit}
      listItem
      nextUpStyle={
        index === 0 && {
          background: [255, 255, 255, 0.15],
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
          highlightWords.length ? bit.body : (bit.body || '').slice(0, 200),
        )}
      </UI.Text>
    </OrbitCard>
  ))
})

const OrbitSearchResultsFrame = view({
  flex: 1,
})
OrbitSearchResultsFrame.theme = ({ theme }) => ({
  background: theme.base.background,
})

const OrbitSearchResultsContents = view(({ name, appStore, searchStore }) => {
  const { isChanging, message } = searchStore.state
  return (
    <OrbitSearchResultsFrame>
      {message ? <div>{message}</div> : null}
      <OrbitSearchQuickResults />
      <div
        style={{
          position: 'relative',
          transition: 'opacity ease-in-out 150ms',
          opacity: isChanging ? 0.7 : 1,
        }}
      >
        <OrbitSearchResultsList searchStore={searchStore} name={name} />
      </div>
      <div style={{ height: 20 }} />
    </OrbitSearchResultsFrame>
  )
})

type Props = {
  searchStore?: OrbitSearchStore
  appStore?: AppStore
  name?: string
}

@view.attach('appStore', 'searchStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  render() {
    const { appStore, searchStore, name } = this.props
    if (!searchStore.state.results) {
      return null
    }
    const transform = {
      y: -searchStore.extraHeight,
    }
    return (
      <OrbitDockedPane
        paddingLeft={0}
        paddingRight={0}
        containerStyle={{
          transition: 'all ease 150ms',
          transform,
          height: '100%',
          flex: 'none',
        }}
        name="search"
        extraCondition={searchStore}
        before={<OrbitSearchFilters />}
      >
        <OrbitSearchResultsContents
          appStore={appStore}
          searchStore={searchStore}
          name={name}
        />
      </OrbitDockedPane>
    )
  }
}
