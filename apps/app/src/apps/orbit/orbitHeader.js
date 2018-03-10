// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'

class HeaderStore {
  inputRef = null

  willMount() {
    this.react(
      () => Electron.orbitState.pinned,
      pinned => {
        if (!pinned) return
        console.log('pinned')
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
        <title>
          <UI.Input
            $orbitInput
            value={orbitStore.query}
            size={1.1}
            onChange={orbitStore.onChangeQuery}
            getRef={headerStore.ref('inputRef').set}
          />
        </title>
        <logoButton css={{ marginLeft: 10 }} onClick={App.togglePinned}>
          <logo
            css={{
              width: 14,
              height: 14,
              background: Electron.orbitState.pinned ? '#555' : '#222',
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
