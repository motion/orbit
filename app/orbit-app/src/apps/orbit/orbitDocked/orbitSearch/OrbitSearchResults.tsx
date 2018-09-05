import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitListItem } from '../../../../views/OrbitListItem'
import { SubPane } from '../../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../../../../stores/SearchStore'
import { SelectionStore } from '../../../../stores/SelectionStore'
import { App } from '@mcro/stores'
import { memoize } from 'lodash'
// import { HighlightsLayer } from '../../../../views/HighlightsLayer'
import { ResolvedItem } from '../../../../components/ItemResolver'
import { SuggestionBarVerticalPad } from '../../../../views'
import { Actions } from '../../../../actions/Actions'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  name?: string
}

const Highlight = view({
  userSelect: 'auto',
  display: 'block',
  lineHeight: 18.5,
  fontSize: 14,
  padding: [2, 6, 2, 10],
  margin: [0, 0, 0, 4],
  fontWeight: 400,
  borderLeft: [2, 'transparent'],
  '&:hover': {
    borderLeftColor: [255, 255, 255, 0.2],
  },
})
Highlight.theme = ({ theme }) => ({
  color: theme.color.alpha(0.95),
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
  Actions.setHighlightIndex(hlIndex)
  return
}

const highlightOptions = (query, bit) => ({
  text: replaceUglies(sanitize(bit.body || '')),
  words: query.split(' ').filter(x => x.length > 2),
  maxChars: 100,
  maxSurroundChars: 110,
  trimWhitespace: true,
  separator: '&nbsp;&middot;&nbsp;',
})

const hideSlack = {
  // title: true,
  people: true,
  date: true,
}

const OrbitCardContent = view({
  padding: [6, 0],
})

const SearchResultText = props => (
  <UI.Text wordBreak="break-all" fontWeight={400} {...props} />
)

@view
class OrbitSearchResultsList extends React.Component<Props> {
  getHighlight = memoize(index => ({ highlights }) => {
    const { selectionStore } = this.props
    return highlights.map((highlight, hlIndex) => {
      return (
        <Highlight
          key={hlIndex}
          dangerouslySetInnerHTML={{ __html: highlight }}
          onClick={selectHighlight(index, hlIndex, selectionStore)}
        />
      )
    })
  })

  getChildren = ({ content }, bit, index) => {
    return bit.integration === 'slack' ? (
      <SearchResultText>{content}</SearchResultText>
    ) : (
      <OrbitCardContent>
        <SearchResultText
          highlight={highlightOptions(
            this.props.searchStore.searchState.query,
            bit,
          )}
        >
          {this.getHighlight(index)}
        </SearchResultText>
      </OrbitCardContent>
    )
  }

  handleLocation = (e, item: ResolvedItem) => {
    e.preventDefault()
    this.props.searchStore.searchFilterStore.setFilter(
      'location',
      item.location,
    )
  }

  spaceBetween = <div style={{ flex: 1 }} />

  render() {
    const { name, searchStore } = this.props
    const { results } = searchStore.searchState
    if (!results || !results.length) {
      return null
    }
    const searchTerm = searchStore.searchState.query
    const quickResultsLen = searchStore.quickSearchState.results.length
    return (
      // <HighlightsLayer term={searchTerm}>
      <>
        {results.map((model, index) => (
          <OrbitListItem
            pane={name}
            subPane="search"
            key={model.id}
            index={index + quickResultsLen}
            model={model}
            hide={model.integration === 'slack' ? hideSlack : null}
            subtitleSpaceBetween={this.spaceBetween}
            isExpanded
            searchTerm={searchTerm}
            onClickLocation={this.handleLocation}
            maxHeight={300}
            overflow="hidden"
          >
            {this.getChildren}
          </OrbitListItem>
        ))}
      </>
      // </HighlightsLayer>
    )
  }
}

const OrbitSearchResultsFrame = view({
  position: 'relative',
  // allows for card glow
  paddingTop: 2,
  transition: 'all ease 100ms',
})

const OrbitSearchResultsContents = view(
  ({ name, searchStore, selectionStore }) => {
    const { isChanging, message } = searchStore
    return (
      <OrbitSearchResultsFrame
        style={{
          opacity: isChanging ? 0.7 : 1,
        }}
      >
        {!!message && <div>{message}</div>}
        <OrbitSearchQuickResults
          searchStore={searchStore}
          selectionStore={selectionStore}
        />
        <OrbitSearchResultsList
          searchStore={searchStore}
          selectionStore={selectionStore}
          name={name}
        />
      </OrbitSearchResultsFrame>
    )
  },
)

@view.attach('searchStore', 'selectionStore', 'paneManagerStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  render() {
    const { searchStore, selectionStore, name } = this.props
    const hideHeight = searchStore.searchFilterStore.extraFiltersVisible
      ? 0
      : searchStore.searchFilterStore.extraFiltersHeight
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
        before={
          <>
            <SuggestionBarVerticalPad />
            <OrbitSearchFilters />
          </>
        }
        onScrollNearBottom={this.props.searchStore.loadMore}
      >
        <OrbitSearchResultsContents
          selectionStore={selectionStore}
          searchStore={searchStore}
          name={name}
        />
      </SubPane>
    )
  }
}
