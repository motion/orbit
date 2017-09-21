import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Actions from '../panes/pane/actions'
import BarStore from './store'
import * as PaneTypes from '../panes'
import { Miller, MillerStore } from '../miller'
import Pane from '~/views/pane'

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
            <forwardcomplete>{barStore.peekItem}</forwardcomplete>
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
    },
    searchIcon: {
      position: 'absolute',
      top: 2,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 18,
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
