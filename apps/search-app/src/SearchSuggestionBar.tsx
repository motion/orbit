import { useSearchState } from '@o/kit'
import { Button, SpaceGroup } from '@o/ui'
import React from 'react'
import { getDateAbbreviated } from './getDateAbbreviated'

const filterAlt = {
  date: 'blue',
  source: 'yellow',
  person: 'orange',
  type: 'green',
  location: 'red',
}

export function SearchSuggestionBar() {
  const state = useSearchState()
  const dateText = getDateAbbreviated(state.filters.dateState)
  const hasTextualDateFilter = !!state.activeDateFilters.length
  return (
    <SpaceGroup>
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
