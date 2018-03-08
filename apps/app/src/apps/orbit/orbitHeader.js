// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import ControlButton from '~/views/controlButton'
import { App, Electron } from '@mcro/all'
// import * as Constants from '~/constants'

class HeaderStore {
  inputRef = null

  willMount() {
    this.react(
      () => Electron.state.lastAction === 'TOGGLE',
      toggled => {
        if (!toggled) return
        console.log('toggled')
        if (this.inputRef) {
          this.inputRef.focus()
          this.inputRef.select()
        }
      },
    )
  }
}

@view.attach('orbitStore')
@view({
  headerStore: HeaderStore,
})
export default class PeekHeader {
  render({ orbitStore, headerStore }) {
    return (
      <header $$draggable $showHeader={App.showHeader}>
        <buttons $$row if={orbitStore.isTorn} css={{ marginRight: 14 }}>
          <ControlButton icon="x" store={orbitStore} />
          <ControlButton icon="y" store={orbitStore} background="#F6BE4F" />
          <ControlButton icon="z" store={orbitStore} background="#62C554" />
        </buttons>
        <title>
          <UI.Input
            $orbitInput
            value={orbitStore.query}
            size={1.1}
            onChange={orbitStore.onChangeQuery}
            getRef={headerStore.ref('inputRef').set}
          />
        </title>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [10, 10],
      transition: 'all ease-in 100ms',
      opacity: 0.2,
      // transform: {
      //   y: -Constants.ORA_HEADER_HEIGHT,
      // },
    },
    showHeader: {
      opacity: 1,
      transform: { y: 0 },
    },
    title: {
      flex: 1,
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}

// <UI.Row
// if={false}
// $controls
// $$undraggable
// itemProps={{
//   sizeIcon: 1,
//   sizePadding: 1.8,
//   sizeHeight: 0.75,
//   sizeRadius: 0.6,
//   borderWidth: 0,
//   color: [0, 0, 0, 0.5],
//   boxShadow: [
//     'inset 0 0.5px 0 0px #fff',
//     '0 0.25px 0.5px 0px rgba(0,0,0,0.35)',
//   ],
//   background: 'linear-gradient(#FDFDFD, #F1F1F1)',
//   hover: {
//     background: 'linear-gradient(#FDFDFD, #F1F1F1)',
//   },
// }}
// >
// <UI.Button
//   if={false}
//   icon="pin"
//   onClick={store.ref('isPinned').toggle}
//   highlight={store.isTorn || store.isPinned}
// />
// </UI.Row>
