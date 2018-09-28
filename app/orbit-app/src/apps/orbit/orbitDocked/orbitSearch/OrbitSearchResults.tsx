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
import { SuggestionBarVerticalPad, SmallVerticalSpace } from '../../../../views'
import { HighlightText } from '../../../../views/HighlightText'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'
import { chunk } from 'lodash'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  name?: string
}

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
          extraProps={{
            minimal: true,
          }}
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
    <>
      <OrbitSearchQuickResults searchStore={searchStore} selectionStore={selectionStore} />
      <OrbitSearchResultsFrame
        style={{
          opacity: isChanging ? 0.7 : 1,
        }}
      >
        {!!message && <div>{message}</div>}
        <OrbitSearchResultsList
          searchStore={searchStore}
          selectionStore={selectionStore}
          name={name}
        />
      </OrbitSearchResultsFrame>
    </>
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
