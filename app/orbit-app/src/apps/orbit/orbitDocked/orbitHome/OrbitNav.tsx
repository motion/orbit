import * as React from "react";
import { PaneManagerStore } from "../../PaneManagerStore";
import { SearchStore } from "../SearchStore";
import { Row, SegmentedRow, Popover, View, Col, Theme, Button } from "@mcro/ui";
import { NavButton } from "../../../../views/NavButton";
import { DateRangePicker } from 'react-date-range'
import { OrbitFilters } from "./OrbitFilters";
import { Centered } from "../../../../views/Centered";
import { RowItem } from "../../orbitHeader/RowItem";
import { view } from "@mcro/black";

@view.attach('paneManagerStore', 'searchStore')
@view
export class OrbitNav extends React.Component<{
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
}> {
  render() {
    const { paneManagerStore, searchStore } = this.props
    return (
      <View position="relative" zIndex={100}>
        <div style={{ height: 2 }} />
        <Row position="relative" alignItems="center" padding={[0, 10]}>
          <SegmentedRow>
            <Popover
              openOnClick
              openOnHover
              closeOnEsc
              target={<NavButton icon="calendar">Any</NavButton>}
              adjust={[180, 0]}
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
              openOnClick
              openOnHover
              background
              closeOnEsc
              target={<NavButton icon="funnel">All</NavButton>}
              adjust={[-10, 0]}
              borderRadius={6}
              elevation={4}
              theme="light"
            >
              <View padding={10}>
                <OrbitFilters />
              </View>
            </Popover>
          </SegmentedRow>

          <Centered>
            <SegmentedRow>
              <NavButton
                onClick={paneManagerStore.activePaneSetter('home')}
                active={paneManagerStore.activePane === 'home'}
                icon="home"
                tooltip="Overview"
              />
              <NavButton
                onClick={paneManagerStore.activePaneSetter('explore')}
                active={paneManagerStore.activePane === 'explore'}
                icon="menu3"
                tooltip="Explore"
              />
            </SegmentedRow>
          </Centered>

          <View flex={1} />

          <SegmentedRow>
            <NavButton>Topics</NavButton>
            <Popover
              openOnClick
              theme="light"
              width={200}
              background
              borderRadius={6}
              elevation={4}
              target={
                <NavButton>
                  <View border={[2, 'blue']} borderRadius={100} width={12} height={12} />
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
                    <Button icon="add">Create</Button>
                  </Theme>
                </Row>
              </Col>
            </Popover>
          </SegmentedRow>
        </Row>
        <div style={{ height: 8 }} />
      </View>
    )
  }
}
