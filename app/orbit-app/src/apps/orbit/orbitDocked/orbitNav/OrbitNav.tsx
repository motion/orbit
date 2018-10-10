import './calendar.css' // theme css file
import * as React from 'react'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../SearchStore'
import { Row, SegmentedRow, Popover, View, Col, Theme, Button } from '@mcro/ui'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'
import { OrbitFilters } from '../orbitHome/OrbitFilters'
import { RowItem } from '../../orbitHeader/RowItem'
import { view } from '@mcro/black'
import { getDateAbbreviated } from './getDateAbbreviated'
import { OrbitSuggestionBar } from '../../orbitHeader/OrbitSuggestionBar'

@view.attach('paneManagerStore', 'searchStore')
@view
export class OrbitNav extends React.Component<{
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
}> {
  render() {
    const { searchStore } = this.props
    return (
      <View position="relative" zIndex={100}>
        <Row position="relative" alignItems="center" padding={[0, 10]}>
          <SegmentedRow>
            <Popover
              delay={100}
              openOnClick
              openOnHover
              closeOnClickAway
              target={
                <NavButton icon="calendar">
                  {getDateAbbreviated(searchStore.searchFilterStore.dateState)}
                </NavButton>
              }
              alignPopover="left"
              adjust={[200, 0]}
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
              closeOnClickAway
              target={<NavButton icon="funnel">All</NavButton>}
              alignPopover="left"
              borderRadius={6}
              elevation={4}
              theme="light"
            >
              <View padding={10}>
                <OrbitFilters />
              </View>
            </Popover>
          </SegmentedRow>
          <OrbitSuggestionBar />
          <SegmentedRow>
            {/* <NavButton onClick={searchStore.searchFilterStore.toggleSearchBy} width={55}>
              {searchStore.searchFilterStore.searchBy}
            </NavButton> */}
            <Popover
              delay={100}
              openOnClick
              theme="light"
              width={200}
              background
              adjust={[-10, 0]}
              borderRadius={6}
              elevation={4}
              target={
                <NavButton>
                  <View
                    background="#222"
                    borderRadius={100}
                    width={14}
                    height={14}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <View border={[2, 'lightblue']} borderRadius={100} width={10} height={10} />
                  </View>
                </NavButton>
              }
            >
              <Col borderRadius={6} overflow="hidden" flex={1}>
                <RowItem orb="blue" title="Orbit" subtitle="20 people" icon="gear" />
                <View flex={1} margin={[2, 10]} background="#eee" height={1} />
                <RowItem orb="grey" title="Me" />
                <RowItem orb="red" title="discuss-things" />

                <Row margin={5} alignItems="center">
                  <View flex={1} />
                  <Theme theme={{ background: '#fff', color: '#444' }}>
                    <Button ignoreSegment icon="add">
                      Create
                    </Button>
                  </Theme>
                </Row>
              </Col>
            </Popover>
          </SegmentedRow>
        </Row>
      </View>
    )
  }
}
