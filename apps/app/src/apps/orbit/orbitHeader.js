import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import * as Constants from '~/constants'
import ControlButton from '~/views/controlButton'

class HeaderStore {
  inputRef = null

  hover = () => {
    this.inputRef.focus()
  }

  blur = () => {
    this.inputRef.blur()
  }

  @react({ delay: 32, log: false })
  focusInput = [
    () => [
      App.isFullyShown || App.orbitState.pinned || App.orbitState.docked,
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
      if (!this.inputRef || !shown) {
        throw react.cancel
      }
      await when(() => !App.isAnimatingOrbit)
      this.inputRef.focus()
    },
  ]

  @react({ delay: 32 })
  blurInput = [
    () => App.isFullyHidden,
    () => {
      if (!this.inputRef) {
        throw react.cancel
      }
      this.inputRef.blur()
    },
  ]

  onClickInput = () => {
    if (!App.orbitState.pinned && Desktop.isHoldingOption) {
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
        css={{
          borderTopLeftRadius:
            !App.orbitOnLeft || App.orbitState.orbitDocked
              ? 0
              : Constants.BORDER_RADIUS,
          borderTopRightRadius:
            App.orbitOnLeft || App.orbitState.orbitDocked
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
            right: App.orbitOnLeft ? 20 : -1,
            left: App.orbitOnLeft ? -1 : 20,
            height: 1,
            background: `linear-gradient(to right, ${theme.base.background}, ${
              theme.active.background
            })`,
            zIndex: 1,
            // boxShadow: [
            //   [
            //     'inset',
            //     App.orbitOnLeft ? 1 : -1,
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
            $inputLnOn={Desktop.hoverState.orbitHovered ? darkerBg : false}
          />
        </title>
        <ControlButton
          if={!App.orbitState.docked}
          onClick={App.togglePinned}
          borderWidth={App.orbitState.pinned ? 0.5 : 2}
          $pinnedIcon
          $onLeft={App.orbitOnLeft}
          $onRight={!App.orbitOnLeft}
          $isPinned={App.orbitState.pinned}
          background={App.orbitState.pinned ? '#7954F9' : 'transparent'}
          borderColor={
            App.orbitState.pinned
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
