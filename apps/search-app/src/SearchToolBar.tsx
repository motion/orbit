import { Row } from '@o/ui'
import React from 'react'
import { SearchSuggestionBar } from './SearchSuggestionBar'

export function SearchToolBar() {
  return (
    <Row flex={1} alignItems="center" justifyContent="center">
      <SearchSuggestionBar />
    </Row>
  )
}
