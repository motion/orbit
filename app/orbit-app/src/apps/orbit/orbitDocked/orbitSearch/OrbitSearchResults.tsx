import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitListItem } from '../../../../views/OrbitListItem'
import { SubPane } from '../../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../SearchStore'
import { SelectionStore } from '../SelectionStore'
// import { App } from '@mcro/stores'
// import { memoize } from 'lodash'
// import { Actions } from '../../../../actions/Actions'
import { SuggestionBarVerticalPad, SmallVerticalSpace } from '../../../../views'
import { HighlightText } from '../../../../views/HighlightText'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'
import { chunk } from 'lodash'
import { handleClickLocation } from '../../../../helpers/handleClickLocation';

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

// old highlights based code... keep for just a bit longer...
// const selectHighlight = (
//   index,
//   hlIndex,
//   selectionStore: SelectionStore,
// ) => e => {
//   const isAlreadyAtHighlight = App.peekState.highlightIndex === hlIndex
//   const isAlreadyAtIndex = selectionStore.activeIndex === index
//   if (isAlreadyAtHighlight && isAlreadyAtIndex) {
//     return
//   }
//   if (isAlreadyAtIndex) {
//     e.stopPropagation()
//   }
//   Actions.setHighlightIndex(hlIndex)
//   return
// }
// getHighlight = memoize(index => ({ highlights }) => {
//   const { selectionStore } = this.props
//   return highlights.map((highlight, hlIndex) => {
//     return (
//       <Highlight
//         key={hlIndex}
//         dangerouslySetInnerHTML={{ __html: highlight }}
//         onClick={selectHighlight(index, hlIndex, selectionStore)}
//       />
//     )
//   })
// })

const hideSlack = {
  title: true,
  people: true,
  date: true,
}

const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const SearchResultText = props => <UI.Text wordBreak="break-all" fontWeight={400} {...props} />
const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ⏎ ') : str)

// stays static and non-reactive to prevent re-rendering during infinite scroll
class OrbitSearchResultsListChunk extends React.Component<{
  results: any[]
  query: string
  offset: number
  searchStore: SearchStore
}> {
  getChildren = ({ content }, bit) => {
    return bit.integration === 'slack' ? (
      <SearchResultText>{content}</SearchResultText>
    ) : (
      <OrbitCardContent>
        <HighlightText whiteSpace="normal" alpha={0.65} options={{ maxSurroundChars: 100 }}>
          {collapseWhitespace(content)}
        </HighlightText>
      </OrbitCardContent>
    )
  }

  spaceBetween = <div style={{ flex: 1 }} />

  render() {
    const { results, query, offset } = this.props
    if (!results || !results.length) {
      return null
    }
    return results.map((model, index) => {
      const isConversation = model.integration === 'slack'
      return (
        <OrbitListItem
          pane={name}
          subPane="search"
          key={model.id}
          index={index + offset}
          model={model}
          hide={isConversation ? hideSlack : null}
          subtitleSpaceBetween={this.spaceBetween}
          isExpanded
          searchTerm={query}
          onClickLocation={handleClickLocation}
          maxHeight={isConversation ? 380 : 200}
          overflow="hidden"
        >
          {this.getChildren}
        </OrbitListItem>
      )
    })
  }
}

@view
class OrbitSearchResultsList extends React.Component<Props> {
  render() {
    const { searchStore } = this.props
    const { results } = searchStore.searchState
    if (!results || !results.length) {
      return null
    }
    const query = searchStore.searchState.query
    const quickResultsLen = searchStore.quickSearchState.results.length
    const chunkAmt = 6
    const resultsGroups = chunk(results, chunkAmt)
    console.log('resultsGroups', resultsGroups)
    let curOffset = quickResultsLen
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: query.split(' '), maxChars: 500, maxSurroundChars: 200 }}
      >
        {resultsGroups.map((group, index) => {
          const next = (
            <OrbitSearchResultsListChunk
              key={`${index}${query}${group.length}`}
              offset={curOffset}
              query={query}
              results={group}
              searchStore={searchStore}
            />
          )
          curOffset += group.length
          return next
        })}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}

const OrbitSearchResultsFrame = view({
  position: 'relative',
  // allows for card glow
  paddingTop: 2,
  transition: 'all ease 100ms',
})

const OrbitSearchResultsContents = view(({ name, searchStore, selectionStore }) => {
  const { isChanging, message } = searchStore
  return (
    <OrbitSearchResultsFrame
      style={{
        opacity: isChanging ? 0.7 : 1,
      }}
    >
      {!!message && <div>{message}</div>}
      <OrbitSearchQuickResults searchStore={searchStore} selectionStore={selectionStore} />
      <OrbitSearchResultsList
        searchStore={searchStore}
        selectionStore={selectionStore}
        name={name}
      />
    </OrbitSearchResultsFrame>
  )
})

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
        <ItemResolverDecorationContext.Provider
          value={{
            item: null,
            text: {
              alpha: 0.6555,
            },
          }}
        >
          <OrbitSearchResultsContents
            selectionStore={selectionStore}
            searchStore={searchStore}
            name={name}
          />
          <SmallVerticalSpace />
        </ItemResolverDecorationContext.Provider>
      </SubPane>
    )
  }
}
