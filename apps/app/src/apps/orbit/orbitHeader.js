// @flow
import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
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
    if (!Electron.orbitState.pinned) {
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
    const { fullScreen } = Electron.orbitState
    const darkerBg = theme.base.background.darken(0.045).desaturate(0.3)
    return (
      <header
        $headerBg={fullScreen ? headerBg.alpha(0.2) : headerBg}
        $$draggable
        $headerVisible={App.isShowingHeader}
        $headerMouseOver={Electron.orbitState.mouseOver}
        css={{
          boxShadow: [
            [
              'inset',
              0,
              0.5,
              0,
              0.5,
              theme.base.background.darken(0.1).desaturate(0.3),
            ],
          ],
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
              opacity: App.state.query.length > 0 ? 1 : 0.6,
            }}
            background="transparent"
            onChange={orbitStore.onChangeQuery}
            onKeyDown={this.handleKeyDown}
            getRef={headerStore.ref('inputRef').set}
            onClick={headerStore.onClickInput}
          />
          <inputLn
            $inputLnOn={Electron.orbitState.mouseOver ? darkerBg : false}
          />
        </title>
        <pinnedIcon
          if={!Electron.orbitState.fullScreen}
          onClick={App.togglePinned}
          $onLeft={Electron.orbitOnLeft}
          $onRight={!Electron.orbitOnLeft}
          $isPinned={Electron.orbitState.pinned}
        >
          <UI.Icon
            color={
              Electron.orbitState.pinned
                ? Constants.ORBIT_COLOR.lighten(0.25)
                : Constants.ORBIT_COLOR.lighten(0.5).alpha(0.5)
            }
            size={12}
            name="pin"
            css={{
              width: 9,
              height: 9,
              borderRadius: 1000,
            }}
          />
        </pinnedIcon>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [5, 10],
      transition: 'all ease-in 300ms',
      opacity: 0.75,
      '&:hover': {
        opacity: 1,
      },
    },
    headerVisible: {
      opacity: 0.6,
      transform: { y: 0 },
    },
    headerMouseOver: {
      opacity: 1,
    },
    headerBg: background => ({
      background: background,
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
    pinnedIcon: {
      position: 'absolute',
      transition: 'all ease-in 100ms 100ms',
      padding: 6,
      margin: [2, 4],
      top: 3,
      borderRadius: 1000,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.4,
      },
    },
    isPinned: {
      opacity: 0.9,
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
