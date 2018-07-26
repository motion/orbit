import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from './OrbitCard'
import { OrbitDockedPane } from './OrbitDockedPane'
import { OrbitSearchQuickResults } from './orbitSearch/OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { SearchStore } from '../../stores/SearchStore'
import debug from '@mcro/debug'

const log = debug('OrbitSearchResults')
const listItemSidePad = 18

const Highlight = view({
  display: 'inline-block',
  lineHeight: 22,
  fontSize: 15,
  padding: [2, listItemSidePad * 2, 2, listItemSidePad],
  margin: [8, -listItemSidePad, 8, 8],
  borderLeft: [3, 'transparent'],
  transition: 'border ease 200ms 100ms',
  color: [0, 0, 0, 0.8],
  '&:hover': {
    color: [0, 0, 0, 1],
    borderLeftColor: '#ddd',
  },
})

type ListProps = {
  name: string
  searchStore: SearchStore
}

const OrbitSearchResultsList = view(({ name, searchStore }: ListProps) => {
  const { results, query } = searchStore.searchState
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
      cardProps={{
        background: '#fff',
        padding: [16, 18, 10],
      }}
      nextUpStyle={
        index === 0 && {
          color: 'black',
        }
      }
    >
      <UI.Text
        alpha={0.85}
        wordBreak="break-all"
        highlight={{
          text: sanitize(bit.body || ''),
          words: highlightWords,
          maxChars: 380,
          maxSurroundChars: 120,
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
                  e.stopPropagation()
                  // don't actually toggle when selecting highlights
                  if (searchStore.activeIndex === index) {
                    return
                  }
                  searchStore.setHighlightIndex(hlIndex)
                  searchStore.toggleSelected(index)
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
    <OrbitSearchResultsFrame>
      {message ? <div>{message}</div> : null}
      <OrbitSearchQuickResults searchStore={searchStore} />
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
  searchStore?: SearchStore
  name?: string
}

@view.attach('searchStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  extraCondition = () => {
    return this.props.searchStore.hasQuery()
  }

  render() {
    const { searchStore, name } = this.props
    if (!searchStore.searchState.results) {
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
        extraCondition={this.extraCondition}
        before={<OrbitSearchFilters />}
      >
        <OrbitSearchResultsContents searchStore={searchStore} name={name} />
      </OrbitDockedPane>
    )
  }
}
