import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchFilterStore } from '../../../stores/SearchFilterStore'
import { PaneManagerStore } from '../PaneManagerStore'

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
}

const FilterBar = view(UI.Row, {
  position: 'relative',
  padding: [0, 15, 6],
})

const HorizontalScroll = view({
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const FilterButton = props => (
  <UI.Button
    glint={false}
    size={1}
    sizeRadius={0.9}
    marginRight={3}
    sizeHeight={0.8}
    sizePadding={0.6}
    fontWeight={600}
    hoverStyle={{
      background: [0, 0, 0, 0.2],
      border: [1, 'transparent'],
    }}
    {...props}
  />
)

const FilterBarFade = view({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: '14%',
  zIndex: 1000,
  pointerEvents: 'none',
})

// FilterBarFade.theme = ({ theme }) => ({
//   background: `linear-gradient(to right, transparent, ${
//     theme.base.background
//   } 80%)`,
// })

type Props = {
  filterStore?: SearchFilterStore
  paneManagerStore: PaneManagerStore
}

const opacityScale = [1, 0.9, 0.8, 0.7, 0.5]

const hideFilterPanes = {
  settings: true,
  onboard: true,
  directory: true,
  apps: true,
}

export const OrbitSuggestionBar = view(
  ({ filterStore, paneManagerStore }: Props) => {
    filterStore.disabledFilters
    if (hideFilterPanes[paneManagerStore.activePane]) {
      return null
    }
    return (
      <FilterBar opacity={hideFilterPanes[paneManagerStore.activePane] ? 0 : 1}>
        <HorizontalScroll>
          {filterStore.allFilters.map((filter, index) => (
            <FilterButton
              key={`${filter.text}${filter.active}`}
              onClick={() => filterStore.toggleFilter(filter.text)}
              opacity={opacityScale[index] || 0.333}
              borderColor={
                (filter.active && activeThemes[filter.type].borderColor) ||
                'transparent'
              }
              borderWidth={1}
              background="transparent"
            >
              {filter.text}
            </FilterButton>
          ))}
          <UI.View width={50} />
        </HorizontalScroll>
        <FilterBarFade />
      </FilterBar>
    )
  },
)
