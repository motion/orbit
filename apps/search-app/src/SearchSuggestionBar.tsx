import { getRelativeDate, useSearchState } from '@o/kit'
import { Button, SpaceGroup } from '@o/ui'
import React from 'react'

const filterAlt = {
  date: 'lightBlue',
  source: 'lightYellow',
  person: 'lightOrange',
  type: 'lightGreen',
  location: 'lightRed',
}

export function SearchSuggestionBar() {
  const state = useSearchState()
  const dateText = getRelativeDate(state.filters.dateState, { short: true })
  const hasTextualDateFilter = !!state.activeDateFilters.length
  return (
    <SpaceGroup space="sm">
      {!!dateText && !hasTextualDateFilter && (
        <Button onClick={state.filters.clearDate} opacity={1} alt={filterAlt.date}>
          {dateText}
        </Button>
      )}
      {state.filters.allFilters.map(filter => (
        <Button
          key={`${filter.text}${filter.active}`}
          onClick={() => state.filters.toggleFilterActive(filter.text)}
          alt={filterAlt[filter.type]}
        >
          {filter.text}
        </Button>
      ))}
    </SpaceGroup>
  )
}
