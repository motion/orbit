import './calendar.css' // theme css file
import * as React from 'react'
import { SearchStore } from '../SearchStore'
import { Row, Popover, View } from '@mcro/ui'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'
import { OrbitFilters } from '../orbitHome/OrbitFilters'
import { view, react, ensure } from '@mcro/black'
import { OrbitSuggestionBar } from '../../orbitHeader/OrbitSuggestionBar'
import { QueryStore } from '../QueryStore'
import { hoverSettler } from '../../../../helpers'
import { ORBIT_WIDTH } from '@mcro/constants'

class OrbitNavStore {
  filtersWidth = 0
  hoveredFilters = false
  filtersRef = null as HTMLDivElement
  // @ts-ignore
  resizeObserver = new ResizeObserver(() => this.measureFilters())
  hoverSettle = hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      this.hoveredFilters = !!res
    },
  })()

  observeFiltersRef = react(
    () => this.filtersRef,
    ref => {
      ensure('ref', !!ref)
      this.resizeObserver.observe(ref)
    },
  )

  willUnmount() {
    this.resizeObserver.disconnect()
  }

  setFilterRef = ref => {
    this.filtersRef = ref
  }

  private measureFilters = () => {
    if (this.filtersRef) {
      this.filtersWidth = Math.min(ORBIT_WIDTH, this.filtersRef.clientWidth)
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
  navButtonBg = theme => (this.props.store.hoverSettle.isStuck() ? theme.background : 'transparent')

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
              key={store.hoverSettle.isStuck()}
              background={this.navButtonBg}
              opacity={
                store.hoveredFilters ||
                store.hoverSettle.isStuck() ||
                !!searchStore.searchFilterStore.hasIntegrationFilters
                  ? 1
                  : 0.5
              }
              onClick={onClick}
              {...hoverProps}
            />
          </Row>

          <Row
            transition="transform ease 120ms, opacity ease 180ms 180ms"
            transform={{
              x: store.hoveredFilters ? 0 : -store.filtersWidth,
            }}
          >
            <View width={store.filtersWidth === 0 ? 'auto' : store.filtersWidth}>
              <OrbitFilters
                opacity={store.hoveredFilters ? 1 : 0}
                forwardRef={store.setFilterRef}
                {...hoverProps}
              />
            </View>
            <OrbitSuggestionBar />
          </Row>
        </Row>
      </View>
    )
  }
}
