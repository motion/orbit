import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SubPane } from '../../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../../../../stores/SearchStore'
import { SelectionStore } from '../../../../stores/SelectionStore'
import { App } from '@mcro/stores'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  name?: string
}

const Highlight = view({
  display: 'inline-block',
  lineHeight: 22,
  fontSize: 15,
  padding: [3, 6, 3, 14],
  margin: [4, 0, 0, 4],
  fontWeight: 400,
  borderLeft: [2, 'transparent'],
  '&:hover': {
    borderLeftColor: '#90b1e455',
  },
})
Highlight.theme = ({ theme }) => ({
  color: theme.base.color.alpha(0.85),
})

const uglies = /([^a-zA-Z]{2,})/g
const replaceUglies = str => str.replace(uglies, ' ')

const selectHighlight = (
  index,
  hlIndex,
  selectionStore: SelectionStore,
) => e => {
  const isAlreadyAtHighlight = App.peekState.highlightIndex === hlIndex
  const isAlreadyAtIndex = selectionStore.activeIndex === index
  if (isAlreadyAtHighlight && isAlreadyAtIndex) {
    return
  }
  if (isAlreadyAtIndex) {
    e.stopPropagation()
  }
  App.actions.setHighlightIndex(hlIndex)
  return
}

const highlightOptions = (query, bit) => ({
  text: replaceUglies(sanitize(bit.body || '')),
  words: query.split(' ').filter(x => x.length > 2),
  maxChars: 300,
  maxSurroundChars: 110,
  trimWhitespace: true,
  separator: '&nbsp;&middot;&nbsp;',
  style: 'font-weight: 700; color: #fff;',
})

const OrbitSearchResultsList = view(
  ({ name, searchStore, selectionStore }: Props) => {
    const { results, query } = searchStore.searchState
    // log(`RENDER SENSITIVE`)
    if (!results || !results.length) {
      return null
    }
    return results.map((bit, index) => (
      <OrbitCard
        pane={name}
        subPane="search"
        key={`${index}${bit.id}`}
        index={index}
        total={results.length}
        bit={bit}
        listItem
      >
        <UI.Text
          alpha={0.85}
          wordBreak="break-all"
          highlight={highlightOptions(query, bit)}
        >
          {({ highlights }) => {
            return highlights.map((highlight, hlIndex) => {
              return (
                <Highlight
                  key={hlIndex}
                  dangerouslySetInnerHTML={{ __html: highlight }}
                  onClick={selectHighlight(index, hlIndex, selectionStore)}
                />
              )
            })
          }}
        </UI.Text>
      </OrbitCard>
    ))
  },
)

const OrbitSearchResultsFrame = view({
  position: 'relative',
  // allows for card glow
  paddingTop: 2,
  transition: 'all ease 100ms',
})

const OrbitSearchResultsContents = view(({ name, searchStore }) => {
  const { isChanging, message } = searchStore
  return (
    <OrbitSearchResultsFrame
      style={{
        opacity: isChanging ? 0.3 : 1,
      }}
    >
      {message ? <div>{message}</div> : null}
      <OrbitSearchQuickResults searchStore={searchStore} />
      <OrbitSearchResultsList searchStore={searchStore} name={name} />
      <div style={{ height: 20 }} />
    </OrbitSearchResultsFrame>
  )
})

@view.attach('searchStore', 'paneManagerStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  render() {
    const { searchStore, name } = this.props
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
        extraCondition={this.props.searchStore.hasQuery}
        before={<OrbitSearchFilters />}
      >
        <OrbitSearchResultsContents searchStore={searchStore} name={name} />
      </SubPane>
    )
  }
}
