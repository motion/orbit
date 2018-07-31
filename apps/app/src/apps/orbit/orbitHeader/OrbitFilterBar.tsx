import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchFilterStore } from '../../../stores/SearchFilterStore'
import { partition } from 'lodash'

const inactiveTheme = {
  background: '#ccc',
  color: '#fff',
}

const activeTheme = {
  background: 'blue',
  color: '#fff',
}

const FilterBar = view(UI.Row, {
  position: 'relative',
  padding: [0, 15, 8],
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
    {...props}
  />
)

const FilterBarFade = view({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: '25%',
  zIndex: 1000,
  pointerEvents: 'none',
})

FilterBarFade.theme = ({ theme }) => ({
  background: `linear-gradient(to right, transparent, ${
    theme.base.background
  })`,
})

export const OrbitFilterBar = ({
  filterStore,
}: {
  filterStore: SearchFilterStore
}) => {
  const [active, inactive] = partition(
    filterStore.filterBarFilters,
    x => x.active,
  )
  return (
    <FilterBar>
      <HorizontalScroll>
        <UI.Theme theme={activeTheme}>
          {active.map((filter, index) => (
            <FilterButton
              key={`${filter.name}${index}`}
              onClick={() => filterStore.toggleFilter(filter)}
            >
              {filter.name}
            </FilterButton>
          ))}
        </UI.Theme>
        <UI.Theme theme={inactiveTheme}>
          {inactive.map((filter, index) => (
            <FilterButton key={`${filter.name}${index}`}>
              {filter.name}
            </FilterButton>
          ))}
        </UI.Theme>
      </HorizontalScroll>
      <FilterBarFade />
    </FilterBar>
  )
}
