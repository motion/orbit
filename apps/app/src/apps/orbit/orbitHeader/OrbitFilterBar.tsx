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
    size={1.1}
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

type Props = {
  filterStore?: SearchFilterStore
}

export const OrbitFilterBar = ({ filterStore }: Props) => {
  const inactiveFilters = [
    ...filterStore.inactiveFilters,
    ...filterStore.suggestedFilters,
  ]
  return (
    <FilterBar>
      <HorizontalScroll>
        <UI.Theme theme={activeTheme}>
          {filterStore.activeFilters.map((filter, index) => (
            <FilterButton
              key={`${filter.text}${index}`}
              onClick={() => filterStore.toggleFilter(filter.text)}
            >
              {filter.text}
            </FilterButton>
          ))}
        </UI.Theme>
        <UI.Theme theme={inactiveTheme}>
          {inactiveFilters.map((filter, index) => (
            <FilterButton key={`${filter.text}${index}`}>
              {filter.text}
            </FilterButton>
          ))}
        </UI.Theme>
        <UI.View width={50} />
      </HorizontalScroll>
      <FilterBarFade />
    </FilterBar>
  )
}
