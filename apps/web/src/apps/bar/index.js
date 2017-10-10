import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import BarStore from './barStore'
import * as PaneTypes from '~/apps/panes'
import { Miller, MillerStore } from '../miller'

@view
class Underline {
  render() {
    return (
      <underline>
        <edge $left />
        <edge $right />
      </underline>
    )
  }

  static style = {
    underline: {
      position: 'absolute',
      bottom: 6,
      height: 5,
      borderBottom: 'dashed 2px rgba(255,255,255,0.5)',
    },
    edge: {
      position: 'absolute',
      bottom: 0,
      top: 0,
    },
    left: {
      left: 0,
      borderLeft: 'dashed 2px rgba(255,255,255,0.5)',
    },
    right: {
      right: 0,
      borderRight: 'dashed 2px rgba(255,255,255,0.5)',
    },
  }

  static theme = props => ({
    underline: {
      width: props.width,
      left: props.left,
    },
  })
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
          <Pane.Actions metaKey={metaKey} actions={actions} />
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
  fontSize: 30,
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
              borderRadius={0}
              onChange={barStore.onSearchChange}
              value={barStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
            <forwardcomplete>
              <fwdcontents>{barStore.peekItem}</fwdcontents>
            </forwardcomplete>
            <Underline if={false} key={1} width={100} left={50} />
            <Underline if={false} key={2} width={100} left={250} />
          </header>
          <Miller
            pane={Pane.Pane}
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
      background: [135, 135, 135, 0.6],
      flex: 1,
    },
    header: {
      position: 'relative',
      height: 75,
      marginTop: -1,
    },
    searchIcon: {
      position: 'absolute',
      top: 3,
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
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      left: 50,
      opacity: 0,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
    fwdcontents: {
      marginTop: 1,
    },
  }
}
