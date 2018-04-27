import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import ControlButton from '~/views/controlButton'

class HeaderStore {
  inputRef = null

  get isShowingHeader() {
    return (
      Electron.orbitState.fullScreen ||
      Electron.orbitState.mouseOver ||
      Electron.orbitState.pinned ||
      false
    )
  }

  hover = () => {
    this.inputRef.focus()
  }

  blur = () => {
    this.inputRef.blur()
  }

  @react({ fireImmediately: true, delay: 32 })
  focusInput = [
    () => [
      App.isFullyShown,
      Electron.orbitState.pinned,
      Electron.isMouseInActiveArea,
    ],
    () => {
      if (!this.inputRef) {
        throw react.cancel
      }
      this.inputRef.focus()
      // this.inputRef.select()
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
@view.attach('orbitStore', 'appStore')
@view({
  headerStore: HeaderStore,
})
export default class OrbitHeader {
  handleKeyDown = e => {
    // up/down
    const { keyCode } = e
    if (keyCode === 38 || keyCode === 40) {
      e.preventDefault()
    }
  }

  render({ appStore, orbitStore, headerStore, theme, headerBg }) {
    const darkerBg = theme.base.background
    return (
      <orbitHeader
        $headerBg={headerBg}
        $headerVisible={headerStore.isShowingHeader}
        $headerMouseOver={Electron.orbitState.mouseOver}
        css={{
          borderTopLeftRadius:
            !Electron.orbitOnLeft || Electron.orbitState.orbitDocked
              ? 0
              : Constants.BORDER_RADIUS,
          borderTopRightRadius:
            Electron.orbitOnLeft || Electron.orbitState.orbitDocker
              ? 0
              : Constants.BORDER_RADIUS,
        }}
        {...appStore.getHoverProps({
          onHover: headerStore.hover,
          onBlur: headerStore.blur,
        })}
      >
        <bottomBorder
          css={{
            position: 'absolute',
            bottom: 0,
            right: Electron.orbitOnLeft ? 20 : -1,
            left: Electron.orbitOnLeft ? -1 : 20,
            height: 1,
            background: `linear-gradient(to right, ${theme.base.background}, ${
              theme.active.background
            })`,
            zIndex: 1,
            // boxShadow: [
            //   [
            //     'inset',
            //     Electron.orbitOnLeft ? 1 : -1,
            //     0,
            //     0,
            //     0.5,
            //     theme.base.background.darken(0.15).desaturate(0.5),
            //   ],
            // ],
          }}
        />
        <title>
          <UI.Icon
            $searchIcon
            name="ui-1_zoom"
            size={15}
            color={theme.active.background.darken(0.15).desaturate(0.4)}
          />
          <UI.Input
            value={orbitStore.query}
            size={1.3}
            sizeRadius
            css={{
              width: '100%',
              fontWeight: 300,
              // boxShadow: ['inset', 0, 0, 0, 1, darkerBg.darken(0.5)],
              opacity: App.state.query.length > 0 ? 1 : 0.6,
              paddingLeft: 42,
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
        <ControlButton
          if={!Electron.orbitState.dockedPinned}
          onClick={App.togglePinned}
          borderWidth={Electron.orbitState.pinned ? 0.5 : 2}
          $pinnedIcon
          $onLeft={Electron.orbitOnLeft}
          $onRight={!Electron.orbitOnLeft}
          $isPinned={Electron.orbitState.pinned}
          background={Electron.orbitState.pinned ? '#7954F9' : 'transparent'}
          borderColor={
            Electron.orbitState.pinned
              ? null
              : theme.base.background.darken(0.4).desaturate(0.6)
          }
        />
      </orbitHeader>
    )
  }

  static style = {
    orbitHeader: {
      position: 'relative',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [3, 2],
      transition: 'all ease-in 300ms',
    },
    controls: {
      position: 'absolute',
      bottom: -12,
      right: 12,
      zIndex: 10000,
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
    },
    headerVisible: {
      transform: { y: 0 },
    },
    headerMouseOver: {
      opacity: 1,
    },
    headerBg: background => ({
      background: `linear-gradient(${background
        .darken(0.03)
        .desaturate(0.5)}, transparent)`,
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
      position: 'relative',
      zIndex: 10000,
      transition: 'all ease-in 100ms 100ms',
      marginRight: 12,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.4,
      },
    },
    isPinned: {
      opacity: 1,
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
    searchIcon: {
      position: 'absolute',
      top: 0,
      left: 14,
      bottom: 0,
      marginBottom: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
