import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import * as Constants from '~/constants'
import ControlButton from '~/views/controlButton'

class HeaderStore {
  inputRef = null

  setInputRef = ref => (this.input = ref)

  focus = () => {
    this.inputRef && this.inputRef.focus()
  }

  @react({ log: false })
  focusInput = [
    () => [
      App.orbitState.pinned || App.orbitState.docked,
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
      if (!shown) throw react.cancel
      await when(() => Desktop.state.focusedOnOrbit)
      await when(() => !App.isAnimatingOrbit)
      this.focus()
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

  componentWillMount() {
    this.hoverSettler = this.props.appStore.getHoverSettler({
      onHover: this.props.headerStore.hover,
    })
  }

  render({ orbitStore, headerStore, theme, headerBg }) {
    return (
      <orbitHeader
        $headerBg={headerBg}
        css={{
          borderTopLeftRadius:
            !App.orbitOnLeft || App.orbitState.docked
              ? 0
              : Constants.BORDER_RADIUS,
          borderTopRightRadius:
            App.orbitOnLeft || App.orbitState.docked
              ? 0
              : Constants.BORDER_RADIUS,
        }}
        {...this.hoverSettler.props}
      >
        <bottomBorder
          css={{
            position: 'absolute',
            bottom: 0,
            height: 1,
            zIndex: 1,
            right: App.orbitOnLeft ? 20 : -1,
            left: App.orbitOnLeft ? -1 : 20,
            background: theme.active.background.darken(0.01).desaturate(0.1),
          }}
        />
        <title>
          <UI.Icon
            $searchIcon
            name="ui-1_zoom"
            size={15}
            color={theme.active.background.darken(0.15).desaturate(0.4)}
          />
          <input
            value={orbitStore.query}
            size={1.3}
            $input
            background="transparent"
            onChange={orbitStore.onChangeQuery}
            onKeyDown={this.handleKeyDown}
            ref={headerStore.setInputRef}
            onClick={headerStore.onClickInput}
          />
          <inputLn />
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
    searchIcon: {
      paddingLeft: 32,
      margin: 0,
    },
    input: {
      width: '100%',
      fontWeight: 300,
      fontSize: 22,
      padding: [10, 10, 10, 30],
      height: 54,
      border: 'none',
      background: 'transparent',
    },
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
      flexFlow: 'row',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
}
