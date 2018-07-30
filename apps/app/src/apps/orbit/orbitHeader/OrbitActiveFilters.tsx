import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

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

const FilterButton = props => (
  <UI.Button
    size={0.95}
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

export const OrbitActiveFilters = ({ filters }) => {
  return (
    <FilterBar>
      {filters.map((filter, index) => {
        return (
          <UI.Theme
            key={`${filter.name}${index}`}
            theme={filter.type === 'active' ? activeTheme : inactiveTheme}
          >
            <FilterButton>{filter.name}</FilterButton>
          </UI.Theme>
        )
      })}
      <FilterBarFade />
    </FilterBar>
  )
}
