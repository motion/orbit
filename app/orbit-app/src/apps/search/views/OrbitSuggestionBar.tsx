import * as React from 'react'
import * as UI from '@mcro/ui'
import { HorizontalScroll } from '../../../views'
import { getDateAbbreviated } from './getDateAbbreviated'
import { ButtonProps } from '@mcro/ui'
import { gloss } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

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

const SuggestionBar = gloss(UI.Row, {
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

const SuggestionButton = (props: ButtonProps) => (
  <UI.Button
    glint={false}
    size={1.2}
    sizeRadius={0}
    sizeHeight={0.7}
    sizePadding={0.5}
    fontWeight={400}
    background="transparent"
    borderColor="transparent"
    borderWidth={0}
    marginRight={8}
    borderTop={[2, 'transparent']}
    alpha={0.7}
    hoverStyle={{
      alpha: 1,
    }}
    {...props}
  />
)

const getBorderColor = filter =>
  (filter.active && activeThemes[filter.type].borderColor) || 'transparent'

export const OrbitSuggestionBar = observer(() => {
  const { queryStore } = useStoresSafe()
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
