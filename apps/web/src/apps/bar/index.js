// @flow
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

@view.provide({ millerStore: MillerStore, barStore: BarStore })
@view
export default class BarPage {
  componentWillMount() {
    this.props.barStore.setMillerStore(this.props.millerStore)
  }

  render({ barStore }) {
    return (
      <UI.Theme name="clear-dark">
        <bar ref={barStore.ref('barRef').set} $$fullscreen>
          <header css={{ borderBottom: [1, [0, 0, 0, 0.1]] }} $$draggable>
            <UI.Input
              onClick={barStore.onClickBar}
              size={2.2}
              getRef={barStore.onInputRef}
              borderRadius={5}
              onChange={barStore.onSearchChange}
              value={barStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={{
                padding: [0, 20],
                ...inputStyle,
              }}
            />
            <forwardcomplete>{barStore.peekItem}</forwardcomplete>
            <pasteicon if={false}>
              <UI.Icon size={50} type="detailed" name="paper" />
            </pasteicon>
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
      background: [100, 100, 110, 0.65],
      flex: 1,
    },
    results: {
      borderTop: [1, 'dotted', [0, 0, 0, 0.1]],
      flex: 2,
      flexFlow: 'row',
      transition: 'transform 80ms linear',
      transform: {
        z: 0,
        x: 0,
      },
    },
    pasteicon: {
      position: 'absolute',
      top: -30,
      right: -20,
      width: 128,
      height: 128,
    },
    forwardcomplete: {
      position: 'absolute',
      top: 25,
      left: 20,
      opacity: 0.3,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
  }
}
