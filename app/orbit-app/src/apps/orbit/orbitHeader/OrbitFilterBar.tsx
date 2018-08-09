import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchFilterStore } from '../../../stores/SearchFilterStore'
import { PaneManagerStore } from '../PaneManagerStore'

const inactiveTheme = {
  background: 'transparent',
  color: '#999',
  hover: {
    background: '#c7c7c7',
    color: '#fff',
  },
}

const activeThemes = {
  date: {
    background: '#ffb049',
    color: '#fff',
  },
  integration: {
    background: 'rgba(71, 189, 36)',
    color: '#fff',
  },
  person: {
    background: '#8279ff',
    color: '#fff',
  },
  type: {
    background: 'rgba(193, 255, 143)',
    color: '#fff',
  },
}

const FilterBar = view(UI.Row, {
  position: 'relative',
  padding: [2, 15, 8],
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
    size={1}
    sizeRadius={0.8}
    marginRight={4}
    sizeHeight={0.8}
    sizePadding={0.6}
    fontWeight={600}
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
}

export const OrbitFilterBar = view(
  ({ filterStore, paneManagerStore }: Props) => {
    filterStore.disabledFilters
    if (hideFilterPanes[paneManagerStore.activePane]) {
      return null
    }
    return (
      <FilterBar opacity={hideFilterPanes[paneManagerStore.activePane] ? 0 : 1}>
        <HorizontalScroll>
          {filterStore.allFilters.map((filter, index) => (
            <UI.Theme
              key={`${filter.text}${filter.active}${index}`}
              theme={filter.active ? activeThemes[filter.type] : inactiveTheme}
            >
              <FilterButton
                onClick={() => filterStore.toggleFilter(filter.text)}
                opacity={opacityScale[index] || 0.333}
              >
                {filter.text}
              </FilterButton>
            </UI.Theme>
          ))}
          <UI.View width={50} />
        </HorizontalScroll>
        <FilterBarFade />
      </FilterBar>
    )
  },
)
