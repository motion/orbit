import './calendar.css' // theme css file
import * as React from 'react'
import { SearchStore } from '../SearchStore'
import { Row, Popover, View } from '@mcro/ui'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'
import { OrbitFilters } from '../orbitHome/OrbitFilters'
import { view } from '@mcro/black'
import { OrbitSuggestionBar } from '../../orbitHeader/OrbitSuggestionBar'
import { QueryStore } from '../QueryStore'

@view.attach('searchStore', 'queryStore')
@view
export class OrbitNav extends React.Component<{
  searchStore?: SearchStore
  queryStore?: QueryStore
}> {
  render() {
    const { searchStore } = this.props
    return (
      <View position="relative" zIndex={100}>
        <Row position="relative" alignItems="center" padding={[0, 10]}>
          <Popover
            delay={100}
            openOnClick
            openOnHover
            closeOnClickAway
            group="filters"
            target={
              <NavButton
                icon="calendar"
                opacity={searchStore.searchFilterStore.hasDateFilter ? 1 : 0.5}
              />
            }
            alignPopover="left"
            adjust={[220, 0]}
            background
            borderRadius={6}
            elevation={4}
            theme="light"
          >
            <View width={440} height={300} className="calendar-dom theme-light" padding={10}>
              <DateRangePicker
                onChange={searchStore.searchFilterStore.onChangeDate}
                ranges={[searchStore.searchFilterStore.dateState]}
              />
            </View>
          </Popover>
          <Popover
            delay={100}
            openOnClick
            openOnHover
            background
            group="filters"
            closeOnClickAway
            target={
              <NavButton
                icon="funnel40"
                opacity={!!searchStore.searchFilterStore.hasIntegrationFilters ? 1 : 0.5}
              />
            }
            alignPopover="left"
            adjust={[54, 0]}
            borderRadius={6}
            overflow="hidden"
            elevation={4}
            theme="light"
          >
            <View width={220} height={220}>
              <OrbitFilters />
            </View>
          </Popover>

          <OrbitSuggestionBar />
        </Row>
      </View>
    )
  }
}
