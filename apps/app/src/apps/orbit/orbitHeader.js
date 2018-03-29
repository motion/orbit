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

@UI.injectTheme
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

  render({ orbitStore, headerStore, theme, headerBg }) {
    const darkerBg = theme.base.background.darken(0.045).desaturate(0.3)
    return (
      <header
        $headerBg={headerBg}
        $$draggable
        $headerVisible={App.isShowingHeader}
        css={{
          borderTopLeftRadius: Electron.orbitOnLeft
            ? Constants.BORDER_RADIUS
            : 0,
          borderTopRightRadius: !Electron.orbitOnLeft
            ? Constants.BORDER_RADIUS
            : 0,
        }}
      >
        <title>
          <UI.Input
            value={App.state.query || ''}
            size={1.35}
            sizeRadius
            css={{
              width: '100%',
              fontWeight: 300,
              boxShadow: ['inset', 0, 0, 0, 1, darkerBg.darken(0.5)],
            }}
            background="transparent"
            onChange={orbitStore.onChangeQuery}
            onKeyDown={this.handleKeyDown}
            getRef={headerStore.ref('inputRef').set}
            onClick={headerStore.onClickInput}
          />
          <inputLn $inputLnOn={App.isShowingHeader ? darkerBg : false} />
        </title>
        <logoButton
          if={!Electron.orbitState.fullScreen}
          onClick={App.togglePinned}
          $onLeft={Electron.orbitOnLeft}
          $onRight={!Electron.orbitOnLeft}
          css={{
            boxShadow: ['inset', 0, 0.5, 0, 1, headerBg.darken(0.5)],
            padding: 3,
            margin: [0, 2],
            border: [4, headerBg],
          }}
        >
          <logo
            css={{
              width: 9,
              height: 9,
              background: Electron.orbitState.pinned
                ? Constants.ORBIT_COLOR.lighten(0.8)
                : darkerBg,
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
      transition: 'all ease-in 300ms',
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
      },
    },
    headerVisible: {
      opacity: 1,
      transform: { y: 0 },
    },
    headerBg: background => ({
      background,
      '&:hover': {
        background: background.lighten(0.05),
      },
    }),
    inputLn: {
      width: 10,
      height: 2,
      flex: 1,
      opacity: 1,
      transform: {
        x: 0,
      },
      transition: 'all ease-in 300ms',
    },
    inputLnOn: background => ({
      background,
      opacity: 1,
      transform: {
        x: 10,
      },
    }),
    logoButton: {
      position: 'absolute',
      top: 3,
      borderRadius: 1000,
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
    },
    onLeft: {
      right: 3,
    },
    onRight: {
      left: 0,
    },
    title: {
      flex: 1,
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
  }
}
