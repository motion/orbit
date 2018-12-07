import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, compose, attach } from '@mcro/black'
import { HorizontalScroll } from '../../../views'
import { getDateAbbreviated } from './getDateAbbreviated'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'

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
  padding: [0, 10],
  transition: 'all ease 90ms 40ms',
  opacity: 0,
  pointerEvents: 'none',
  transform: {
    x: 6,
  },
  visible: {
    pointerEvents: 'inherit',
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
    size={1.1}
    sizeRadius={0}
    sizeHeight={0.8}
    sizePadding={0.3}
    fontWeight={400}
    themeSelect={suggestionTheme}
    background="transparent"
    borderColor="transparent"
    borderWidth={0}
    marginRight={8}
    borderTop={[2, 'transparent']}
    {...props}
  />
)

type Props = {
  queryStore?: QueryStore
}

const getBorderColor = filter =>
  (filter.active && activeThemes[filter.type].borderColor) || 'transparent'

const decorator = compose(
  attach('queryStore'),
  view,
)
export const OrbitSuggestionBar = decorator(({ queryStore }: Props) => {
  const filterStore = queryStore.queryFilters
  const dateFilter = getDateAbbreviated(queryStore.queryFilters.dateState)
  const hasTextualDateFilter = !!filterStore.activeDateFilters.length
  filterStore.disabledFilters
  return (
    <SuggestionBar visible>
      <HorizontalScroll height={24}>
        {!!dateFilter && !hasTextualDateFilter && (
          <SuggestionButton
            onClick={filterStore.clearDate}
            opacity={1}
            borderBottom={[2, activeThemes.date.borderColor]}
          >
            {dateFilter}
          </SuggestionButton>
        )}
        {filterStore.allFilters.map(filter => (
          <SuggestionButton
            key={`${filter.text}${filter.active}`}
            onClick={() => filterStore.toggleFilterActive(filter.text)}
            borderBottom={[2, getBorderColor(filter)]}
          >
            {filter.text}
          </SuggestionButton>
        ))}
      </HorizontalScroll>
    </SuggestionBar>
  )
})
