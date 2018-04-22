import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import * as Constants from '~/constants'

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
    // const { fullScreen } = Electron.orbitState
    const darkerBg = theme.base.background
    return (
      <header
        $headerBg={headerBg}
        $$draggable
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
            left: -1,
            right: 20,
            top: 0,
            boxShadow: [
              [
                'inset',
                1,
                0,
                0,
                0.5,
                theme.base.background.darken(0.12).desaturate(0.5),
              ],
            ],
          }}
        />
        <title>
          <UI.Input
            value={orbitStore.query}
            size={1.3}
            sizeRadius
            css={{
              width: '100%',
              fontWeight: 300,
              // boxShadow: ['inset', 0, 0, 0, 1, darkerBg.darken(0.5)],
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
        <controls if={false}>
          <UI.Button
            icon="gear"
            borderRadius={100}
            size={0.9}
            circular
            background={headerBg}
            color={appStore.showSettings ? [0, 0, 0, 0.8] : [0, 0, 0, 0.2]}
            hover={{
              color: appStore.showSettings ? [0, 0, 0, 0.9] : [0, 0, 0, 0.3],
            }}
            onClick={appStore.toggleSettings}
          />
        </controls>
      </header>
    )
  }

  static style = {
    header: {
      position: 'relative',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [3, 2],
      transition: 'all ease-in 300ms',
      opacity: 0.75,
      '&:hover': {
        opacity: 1,
      },
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
      opacity: 0.6,
      transform: { y: 0 },
    },
    headerMouseOver: {
      opacity: 1,
    },
    headerBg: background => ({
      background: `linear-gradient(${background
        .darken(0.06)
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
  }
}
