// @flow
import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'

class HeaderStore {
  inputRef = null

  @react({ fireImmediately: true, delay: 32 })
  focusInput = [
    () => App.isFullyShown,
    () => {
      if (!this.inputRef) return
      this.inputRef.focus()
      this.inputRef.select()
    },
  ]

  @react({ delay: 32 })
  blurInput = [
    () => App.isFullyHidden,
    () => {
      this.inputRef.blur()
    },
  ]

  onClickInput = () => {
    if (!Electron.orbitState.pinned && Desktop.isHoldingOption) {
      App.togglePinned()
    }
  }
}

@view.attach('orbitStore')
@view({
  headerStore: HeaderStore,
})
export default class PeekHeader {
  handleKeyDown = e => {
    // up/down
    const { keyCode } = e
    if (keyCode === 38 || keyCode === 40) {
      e.preventDefault()
    }
  }

  render({ orbitStore, headerStore }) {
    return (
      <header $$draggable $headerVisible={App.isShowingHeader}>
        <title>
          <UI.Input
            $orbitInput
            value={App.state.query || ''}
            size={1.15}
            borderRadius={5}
            borderWidth={0}
            background="#333"
            onChange={orbitStore.onChangeQuery}
            onKeyDown={this.handleKeyDown}
            getRef={headerStore.ref('inputRef').set}
            onClick={headerStore.onClickInput}
          />
        </title>
        <logoButton
          if={!Electron.orbitState.fullScreen}
          onClick={App.togglePinned}
          $onLeft={Electron.orbitOnLeft}
          $onRight={!Electron.orbitOnLeft}
        >
          <logo
            css={{
              width: 11,
              height: 11,
              background: Electron.orbitState.pinned
                ? Constants.ORBIT_COLOR
                : '#333',
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
    },
    logoButton: {
      position: 'absolute',
      top: 3,
      border: [4, '#151515'],
      borderRadius: 1000,
    },
    onLeft: {
      right: 3,
    },
    onRight: {
      left: 0,
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
