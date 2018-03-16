// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'

class HeaderStore {
  inputRef = null

  willMount() {
    this.react(
      () => Electron.orbitState.pinned || Electron.orbitState.fullScreen,
      shouldFocus => {
        if (!shouldFocus) return
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
      <header $$draggable $headerVisible={App.isShowingHeader}>
        <title>
          <UI.Input
            $orbitInput
            value={App.state.query || ''}
            size={1.2}
            borderRadius={5}
            borderWidth={0}
            background="#222"
            onChange={orbitStore.onChangeQuery}
            getRef={headerStore.ref('inputRef').set}
          />
        </title>
        <logoButton
          if={!Electron.orbitState.fullScreen}
          onClick={App.togglePinned}
        >
          <logo
            css={{
              width: 14,
              height: 14,
              background: Electron.orbitState.pinned ? '#643E96' : '#222',
              borderRadius: 1000,
            }}
          />
        </logoButton>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [12, 10],
      transition: 'all ease-in 100ms',
      opacity: 0.2,
      // transform: {
      //   y: -Constants.ORA_HEADER_HEIGHT,
      // },
    },
    logoButton: {
      position: 'absolute',
      top: 3,
      right: 3,
      border: [5, '#151515'],
      borderRadius: 1000,
    },
    headerVisible: {
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
