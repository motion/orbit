import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, compose } from '@mcro/black'
import { PaneManagerStore } from '../PaneManagerStore'
import { SearchStore } from '../orbitDocked/SearchStore'
import { HorizontalScroll } from '../../../views'
import { getDateAbbreviated } from '../orbitDocked/orbitNav/getDateAbbreviated'

const dateBg = UI.color('#ffb049')

const activeThemes = {
  date: {
    borderColor: dateBg.alpha(0.5),
    color: '#fff',
  },
  integration: {
    borderColor: 'rgba(71, 189, 36, 0.5)',
    color: '#fff',
  },
  person: {
    borderColor: '#8279ff',
    color: '#fff',
  },
  type: {
    borderColor: 'rgba(193, 255, 143)',
    color: '#fff',
  },
  location: {
    borderColor: '#007FAA',
    color: '#fff',
  },
}

const SuggestionBar = view(UI.Row, {
  flex: 1,
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  // above subpane
  zIndex: 10,
  padding: [0, 15, 0],
  transition: 'all ease 90ms 40ms',
  opacity: 0,
  pointerEvents: 'none',
  transform: {
    x: 6,
  },
  visible: {
    pointerEvents: 'auto',
    opacity: 0.8,
    transform: {
      x: 0,
    },
  },
})

const suggestionTheme = theme => ({
  background: theme.background.alpha(0.2),
  color: theme.color.alpha(0.6),
  backgroundHover: theme.backgroundHover.alpha(0.1),
})

const SuggestionButton = props => (
  <UI.Button
    glint={false}
    size={0.9}
    sizeRadius={0}
    sizeHeight={0.8}
    sizePadding={0.3}
    fontWeight={600}
    themeSelect={suggestionTheme}
    background="transparent"
    borderColor="transparent"
    borderWidth={0}
    marginRight={6}
    {...props}
  />
)

const SuggestionBarFade = view({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: '14%',
  zIndex: 1000,
  pointerEvents: 'none',
})

type Props = {
  searchStore?: SearchStore
  paneManagerStore: PaneManagerStore
}

const opacityScale = [1, 0.9, 0.8, 0.7, 0.5]

const getBorderColor = filter =>
  (filter.active && activeThemes[filter.type].borderColor) || 'transparent'

const decorator = compose(
  view.attach('searchStore', 'paneManagerStore'),
  view,
)
export const OrbitSuggestionBar = decorator(({ searchStore }: Props) => {
  const filterStore = searchStore.searchFilterStore
  const dateFilter = getDateAbbreviated(searchStore.searchFilterStore.dateState)
  const hasTextualDateFilter = filterStore.allFilters.findIndex(x => x.type === 'date') > -1
  filterStore.disabledFilters
  return (
    <SuggestionBar visible>
      <HorizontalScroll height={28}>
        {!!dateFilter &&
          !hasTextualDateFilter && (
            <SuggestionButton
              onClick={filterStore.clearDate}
              opacity={1}
              borderBottom={[2, getBorderColor({ type: 'date' })]}
            >
              {dateFilter}
            </SuggestionButton>
          )}
        {filterStore.allFilters.map((filter, index) => (
          <SuggestionButton
            key={`${filter.text}${filter.active}`}
            onClick={() => filterStore.toggleFilterActive(filter.text)}
            opacity={opacityScale[index] || 0.333}
            borderBottom={[2, getBorderColor(filter)]}
          >
            {filter.text}
          </SuggestionButton>
        ))}
        <UI.View width={50} />
      </HorizontalScroll>
      <SuggestionBarFade />
    </SuggestionBar>
  )
})
