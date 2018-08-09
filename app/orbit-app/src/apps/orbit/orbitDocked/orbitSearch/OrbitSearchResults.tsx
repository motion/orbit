import * as React from 'react'
import { view, react } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SubPane } from '../../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import { OrbitSearchFilters } from './OrbitSearchFilters'
import { SearchStore } from '../../../../stores/SearchStore'
import { PaneManagerStore } from '../../PaneManagerStore'

type Props = {
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  name?: string
  store?: SubSearchStore
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
    borderLeftColor: '#90b1e4',
  },
})
Highlight.theme = ({ theme }) => ({
  color: theme.base.color.alpha(0.85),
})

const uglies = /([^a-zA-Z]{2,})/g
const replaceUglies = str => str.replace(uglies, ' ')

const selectHighlight = (index, hlIndex, searchStore) => e => {
  const isAlreadyAtHighlight = searchStore.highlightIndex === hlIndex
  const isAlreadyAtIndex = searchStore.activeIndex === index
  if (isAlreadyAtHighlight && isAlreadyAtIndex) {
    return
  }
  if (isAlreadyAtIndex) {
    e.stopPropagation()
  }
  searchStore.setHighlightIndex(hlIndex)
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

const OrbitSearchResultsList = view(({ name, store, searchStore }: Props) => {
  const { results, query } = store.state
  // log(`RENDER SENSITIVE`)
  if (!results || !results.length) {
    return null
  }
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
        highlight={highlightOptions(query, bit)}
      >
        {({ highlights }) => {
          return highlights.map((highlight, hlIndex) => {
            return (
              <Highlight
                key={hlIndex}
                dangerouslySetInnerHTML={{ __html: highlight }}
                onClick={selectHighlight(index, hlIndex, searchStore)}
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

const OrbitSearchResultsContents = view(({ name, searchStore, store }) => {
  const { isChanging, message } = searchStore
  return (
    <div
      style={{
        position: 'relative',
        opacity: isChanging ? 0.3 : 1,
        // allows for card glow
        paddingTop: 2,
      }}
    >
      {message ? <div>{message}</div> : null}
      <OrbitSearchQuickResults searchStore={searchStore} store={store} />
      <OrbitSearchResultsList
        searchStore={searchStore}
        store={store}
        name={name}
      />
      <div style={{ height: 20 }} />
    </div>
  )
})

class SubSearchStore {
  props: Props

  get isActive() {
    return this.props.paneManagerStore.activePane === 'search'
  }

  state = react(
    () => this.props.searchStore.searchState,
    state => {
      if (!this.isActive) {
        throw react.cancel
      }
      return state
    },
    { log: false, immediate: true, defaultValue: {} },
  )
}

@view.attach('searchStore', 'paneManagerStore')
@view.attach({
  store: SubSearchStore,
})
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
    const { store, searchStore, name } = this.props
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
        <OrbitSearchResultsContents
          store={store}
          searchStore={searchStore}
          name={name}
        />
      </SubPane>
    )
  }
}
