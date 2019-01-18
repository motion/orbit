import { gloss } from '@mcro/gloss'
import { Popover, Row, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { NavButton } from '../../../views/NavButton'
import './calendar.css' // theme css file
import OrbitSuggestionBar from './OrbitSuggestionBar'

export default observer(function SearchNav() {
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore

  return (
    <>
      <Row position="relative" zIndex={1} padding={[0, 40, 0, 0]}>
        <Popover
          delay={100}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          target={<NavButton icon="calendar" />}
          background
          borderRadius={6}
          elevation={4}
          theme="light"
        >
          <View width={440} height={300} className="calendar-dom theme-light" padding={10}>
            <DateRangePicker
              onChange={queryFilters.onChangeDate}
              ranges={[queryFilters.dateState]}
            />
          </View>
        </Popover>
        <NavButton onClick={queryFilters.toggleSortBy} tooltip="Sort by">
          {queryFilters.sortBy}
        </NavButton>
      </Row>

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
