import { toColor, useSearchState } from '@o/kit'
import { Button, ButtonProps, gloss, Row } from '@o/ui'
import React from 'react'
import { getDateAbbreviated } from './getDateAbbreviated'

const dateBg = toColor('#ffb049')

const activeThemes = {
  date: {
    borderColor: dateBg.alpha(0.5),
    color: '#fff',
  },
  source: {
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

const SuggestionBar = gloss(Row, {
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
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
  <Button
    glint={false}
    size={1}
    sizeRadius={0}
    sizeHeight={0.7}
    sizePadding={0.5}
    fontWeight={400}
    background="transparent"
    borderColor="transparent"
    borderWidth={0}
    marginRight={8}
    borderTop={[2, 'transparent']}
    alpha={0.6}
    hoverStyle={{
      alpha: 1,
    }}
    {...props}
  />
)

const getBorderColor = filter =>
  (filter.active && activeThemes[filter.type].borderColor) || 'transparent'

export function SearchSuggestionBar() {
  const state = useSearchState()
  const dateText = getDateAbbreviated(state.queryFilters.dateState)
  const hasTextualDateFilter = !!state.activeDateFilters.length
  return (
    <SuggestionBar visible>
      {!!dateText && !hasTextualDateFilter && (
        <SuggestionButton
          onClick={state.filters.clearDate}
          opacity={1}
          borderBottom={[2, activeThemes.date.borderColor]}
        >
          {dateText}
        </SuggestionButton>
      )}
      {state.filters.allFilters.map(filter => (
        <SuggestionButton
          key={`${filter.text}${filter.active}`}
          onClick={() => state.filters.toggleFilterActive(filter.text)}
          borderBottom={[2, getBorderColor(filter)]}
        >
          {filter.text}
        </SuggestionButton>
      ))}
    </SuggestionBar>
  )
}
