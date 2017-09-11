// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Actions from './panes/pane/actions'
import BarStore from './barStore'
import { Miller, MillerState } from './miller'

const safeString = thing => {
  try {
    return JSON.stringify(thing)
  } catch (e) {
    console.log('non safe object', thing)
    return `${thing}`
  }
}

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

const paneProps = {
  itemProps: {
    size: 1.2,
    glow: false,
    hoverable: true,
    fontSize: 26,
    padding: [10, 10],
    highlightBackground: [0, 0, 0, 0.2],
    highlightColor: [255, 255, 255, 1],
  },
}

@view.provide({ barStore: BarStore, millerState: MillerState })
@view
export default class BarPage {
  render({ barStore: store }) {
    return (
      <UI.Theme name="clear-dark">
        <bar ref={store.ref('barRef').set} $$fullscreen>
          <header css={{ borderBottom: [1, [0, 0, 0, 0.1]] }} $$draggable>
            <UI.Input
              size={2.2}
              getRef={store.onInputRef}
              borderRadius={5}
              onChange={store.onSearchChange}
              value={store.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={{
                padding: [0, 20],
                ...inputStyle,
              }}
            />
            <forwardcomplete>{store.peekItem}</forwardcomplete>
            <pasteicon if={false}>
              <UI.Icon size={50} type="detailed" name="paper" />
            </pasteicon>
            <selected
              if={false}
              css={{
                position: 'absolute',
                top: 80,
                left: 0,
                right: 0,
                height: 20,
                fontSize: 12,
                overflow: 'hidden',
                opacity: 0.8,
                color: '#fff',
              }}
            >
              Selected: {safeString(store.activeItem)}
            </selected>
          </header>
          <Miller
            search={store.search}
            panes={store.PANE_TYPES}
            paneProps={paneProps}
            onKeyActions={val => {
              store.millerKeyActions = val
            }}
          />
          <UI.Popover
            if={store.activeAction}
            open={true}
            onClose={() => {
              store.activeAction = null
            }}
            borderRadius={5}
            elevation={3}
            target={`.target-${store.activeAction.name}`}
            overlay="transparent"
            distance={8}
          >
            {store.activeAction.popover}
          </UI.Popover>

          <BottomActions
            metaKey={store.metaKey}
            actions={store.toolbarActions()}
          />
        </bar>
      </UI.Theme>
    )
  }

  static style = {
    bar: {
      background: [150, 150, 150, 0.65],
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
