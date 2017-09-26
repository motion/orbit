import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Actions from '../panes/pane/actions'
import BarStore from './store'
import * as PaneTypes from '../panes'
import { Miller, MillerStore } from '../miller'
import Pane from '~/views/pane'
import { format } from 'date-fns'

const commas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

@view.ui
class BottomActions {
  render({ actions, metaKey }) {
    return (
      <bar $$draggable>
        <section>
          <UI.Text $label>Team: Motion</UI.Text>
        </section>
        <section>
          <UI.Text $label>⌘ Actions</UI.Text>
          <Actions metaKey={metaKey} actions={actions} />
        </section>
      </bar>
    )
  }

  static style = {
    bar: {
      justifyContent: 'space-between',
      flexFlow: 'row',
      height: 32,
      alignItems: 'center',
      padding: [0, 10],
      // background: [255, 255, 255, 0.1],
      borderTop: [1, [0, 0, 0, 0.1]],
    },
    section: {
      flexFlow: 'row',
    },
    label: {
      marginRight: 0,
      opacity: 0.5,
    },
  }
}

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 32,
}

@view.provide({
  millerStore: MillerStore,
  barStore: BarStore,
})
@view
export default class BarPage {
  componentWillMount() {
    this.props.barStore.setMillerStore(this.props.millerStore)
  }

  render({ barStore }) {
    const { filters } = barStore
    const avatar = s => `/images/${s === 'nate' ? 'me' : s}.jpg`

    const getDate = date => (
      <date $$row>
        <UI.Text css={{ marginRight: 5, alignSelf: 'center' }} size={2} $num>
          {format(date, 'D')}
        </UI.Text>
        <right>
          <UI.Text $desc>{format(date, 'MMM GGGG')}</UI.Text>
          <UI.Text css={{ marginTop: -3 }} opacity={0.7} $day>
            {format(date, 'dddd')}
          </UI.Text>
        </right>
      </date>
    )

    return (
      <UI.Theme name="clear-dark">
        <bar ref={barStore.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={18}
              name="zoom"
              color={[255, 255, 255, 0.1]}
            />
            <UI.Input
              if={false}
              $searchInput
              onClick={barStore.onClickBar}
              size={2.2}
              getRef={barStore.onInputRef}
              borderRadius={5}
              onChange={barStore.onSearchChange}
              value={barStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
            <forwardcomplete if={false}>{barStore.peekItem}</forwardcomplete>
            <fancy
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 40,
                marginTop: 5,
                height: 50,
              }}
              $$row
            >
              <left $$row css={{ alignItems: 'center' }}>
                <people
                  style={{ alignItems: 'center' }}
                  $$row
                  if={filters.people}
                >
                  {filters.people.map(person => (
                    <UI.Button
                      css={{ marginTop: 12, marginLeft: 5, marginRight: 5 }}
                      size={1.6}
                      chromeless
                      icon={<img src={avatar(person)} $avatar />}
                    >
                      {person}
                    </UI.Button>
                  ))}
                </people>
                <dates
                  css={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                  $$row
                  if={filters.startDate}
                >
                  {getDate(filters.startDate)}
                  <UI.Button
                    css={{ marginRight: 5, marginLeft: 5, marginTop: 5 }}
                    size={1.0}
                    chromeless
                    icon="arrows-1_bold-right"
                  />
                  {getDate(filters.endDate)}
                </dates>
              </left>
              <type if={barStore.resultCount > 0}>
                <UI.Button
                  opacity={0.7}
                  chromeless
                  css={{ marginTop: 12, marginRight: 10 }}
                  size={1.6}
                >
                  {commas(barStore.resultCount) + ' '} {filters.type || 'item'}s
                </UI.Button>
              </type>
            </fancy>
          </header>
          <Miller
            pane={Pane}
            panes={PaneTypes}
            onKeyActions={barStore.ref('millerKeyActions').set}
          />
          <BottomActions
            if={false}
            metaKey={barStore.metaKey}
            actions={barStore.toolbarActions()}
          />
        </bar>
      </UI.Theme>
    )
  }

  static style = {
    bar: {
      background: [120, 120, 120, 0.7],
      flex: 1,
    },
    header: {
      position: 'relative',
      height: 70,
    },
    searchIcon: {
      position: 'absolute',
      top: 2,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 18,
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 100,
    },
    searchInput: {
      padding: [0, 20, 0, 50],
    },
    forwardcomplete: {
      position: 'absolute',
      top: 23,
      left: 50,
      opacity: 0.3,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
  }
}
