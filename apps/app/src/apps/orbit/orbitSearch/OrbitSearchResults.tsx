import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '../../../views/OrbitCard'
import { SubPane } from '../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { SearchStore } from '../../../stores/SearchStore'

const Highlight = view({
  display: 'inline-block',
  lineHeight: 22,
  fontSize: 15,
  padding: [3, 6, 3, 14],
  margin: [4, 0, 0, 4],
  borderLeft: [2, 'transparent'],
  color: [0, 0, 0, 0.8],
  '&:hover': {
    borderLeftColor: '#90b1e4',
  },
})

type ListProps = {
  name: string
  searchStore: SearchStore
}

const OrbitSearchResultsList = view(({ name, searchStore }: ListProps) => {
  const { results, query } = searchStore.searchState
  // log(`RENDER SENSITIVE`)
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
    >
      <UI.Text
        alpha={0.85}
        wordBreak="break-all"
        highlight={{
          text: sanitize(bit.body || ''),
          words: highlightWords,
          maxChars: 380,
          maxSurroundChars: 110,
          trimWhitespace: true,
          separator: '&nbsp;&middot;&nbsp;',
        }}
      >
        {({ highlights }) => {
          return highlights.map((highlight, hlIndex) => {
            return (
              <Highlight
                key={hlIndex}
                dangerouslySetInnerHTML={{ __html: highlight }}
                onClick={e => {
                  const isAlreadyAtHighlight =
                    searchStore.activeIndex === index &&
                    searchStore.highlightIndex === hlIndex
                  if (!isAlreadyAtHighlight) {
                    e.stopPropagation()
                    searchStore.setHighlightIndex(hlIndex)
                    return
                  }
                }}
              />
            )
          })
        }}
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

const OrbitSearchResultsContents = view(({ name, searchStore }) => {
  const { isChanging, message } = searchStore
  return (
    <div
      style={{
        position: 'relative',
        opacity: isChanging ? 0.3 : 1,
      }}
    >
      {message ? <div>{message}</div> : null}
      <OrbitSearchQuickResults searchStore={searchStore} />
      <OrbitSearchResultsList searchStore={searchStore} name={name} />
      <div style={{ height: 20 }} />
    </div>
  )
})

type Props = {
  searchStore?: SearchStore
  name?: string
}

@view.attach('searchStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  extraCondition = () => {
    return this.props.searchStore.hasQuery()
  }

  paneRef = React.createRef()

  updateActivePane = () => {
    this.props.searchStore.setActivePane(this.paneRef)
  }

  render() {
    const { searchStore, name } = this.props
    if (!searchStore.searchState.results) {
      return null
    }
    const hideHeight = searchStore.extraFiltersVisible
      ? 0
      : searchStore.extraFiltersHeight
    const transform = {
      y: -hideHeight,
    }
    return (
      <SubPane
        transition="none"
        paddingLeft={0}
        paddingRight={0}
        containerStyle={{
          transition: 'all ease 150ms',
          transform,
          height: '100%',
          flex: 'none',
        }}
        name="search"
        extraCondition={this.extraCondition}
        before={<OrbitSearchFilters />}
        onActive={this.updateActivePane}
      >
        <OrbitSearchResultsContents searchStore={searchStore} name={name} />
      </SubPane>
    )
  }
}
