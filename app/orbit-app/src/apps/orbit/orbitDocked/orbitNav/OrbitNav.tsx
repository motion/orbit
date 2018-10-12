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
import { hoverSettler } from '../../../../helpers'
import { ORBIT_WIDTH } from '@mcro/constants'

class OrbitNavStore {
  filtersWidth: number | string = 'auto'
  hoveredFilters = false
  filtersRef = React.createRef<HTMLDivElement>()
  // @ts-ignore
  resizeObserver = new ResizeObserver(() => this.measureFilters())
  hoverSettle = hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      console.log('hoveer', res)
      this.hoveredFilters = !!res
    },
  })()

  didMount() {
    this.resizeObserver.observe(this.filtersRef.current)
  }

  willUnmount() {
    this.resizeObserver.disconnect()
  }

  private measureFilters = () => {
    if (this.filtersRef) {
      console.log('measueree', this.filtersRef.current)
      this.filtersWidth = Math.min(ORBIT_WIDTH, this.filtersRef.current.clientWidth)
    }
  }
}

@view.attach('searchStore', 'queryStore')
@view.attach({
  store: OrbitNavStore,
})
@view
export class OrbitNav extends React.Component<{
  searchStore?: SearchStore
  queryStore?: QueryStore
  store?: OrbitNavStore
}> {
  render() {
    const { searchStore, store } = this.props
    const { onClick, ...hoverProps } = store.hoverSettle.props
    return (
      <View position="relative" zIndex={100} overflow="hidden">
        <Row position="relative" alignItems="center" padding={[0, 10]}>
          <Row position="relative" zIndex={1}>
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
            <NavButton
              icon="funnel40"
              opacity={
                store.hoverSettle.isStuck() || !!searchStore.searchFilterStore.hasIntegrationFilters
                  ? 1
                  : 0.5
              }
              onClick={onClick}
              {...hoverProps}
            />
          </Row>
          {/* <Popover
            delay={100}
            openOnClick
            openOnHover
            background
            group="filters"
            closeOnClickAway
            target={

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
          </Popover> */}

          <Row
            transition="transform ease 120ms, opacity ease 80ms 80ms"
            transform={{
              x: store.hoveredFilters ? 0 : -store.filtersWidth,
            }}
          >
            <OrbitFilters
              width={store.filtersWidth === 0 ? 'auto' : store.filtersWidth}
              opacity={store.hoveredFilters ? 1 : 0}
              forwardRef={store.filtersRef}
              {...hoverProps}
            />
            <OrbitSuggestionBar />
          </Row>
        </Row>
      </View>
    )
  }
}
