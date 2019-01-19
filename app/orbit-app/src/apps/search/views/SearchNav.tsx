import { gloss } from '@mcro/gloss'
import { View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
// import './calendar.css' // theme css file
import OrbitSuggestionBar from './OrbitSuggestionBar'

export default observer(function SearchNav() {
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore

  return (
    <>
      <ScrollableRow flex={10}>
        <OrbitSuggestionBar />
      </ScrollableRow>
    </>
  )
})

const ScrollableRow = gloss(View, {
  flexFlow: 'row',
  overflowX: 'auto',
  alignItems: 'center',
  padding: [0, 20],
})
