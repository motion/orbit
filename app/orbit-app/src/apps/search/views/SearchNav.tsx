import './calendar.css' // theme css file
import * as React from 'react'
import { Row, View, Popover, Icon } from '@mcro/ui'
import { NavButton } from '../../../views/NavButton'
import { StoreContext, view } from '@mcro/black'
import { OrbitSuggestionBar } from './OrbitSuggestionBar'
import { DateRangePicker } from 'react-date-range'
import { SearchFilters } from './SearchFilters'
import { observer } from 'mobx-react-lite'

export const SearchNav = observer(() => {
  const { queryStore } = React.useContext(StoreContext)
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
          alignPopover="left"
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
        <NavButton onClick={queryFilters.toggleSortBy} tooltip={queryFilters.sortBy}>
          {queryFilters.sortBy}
        </NavButton>
      </Row>

      <ScrollableRow flex={10}>
        <OrbitSuggestionBar />
      </ScrollableRow>

      <ScrollableRow maxWidth="33%">
        <Icon name="funnel" size={10} opacity={0.65} color="#999" marginRight={10} />
        <SearchFilters />
      </ScrollableRow>
    </>
  )
})

const ScrollableRow = view(View, {
  flexFlow: 'row',
  overflowX: 'auto',
  alignItems: 'center',
  padding: [0, 20],
})
