import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import * as Constants from '~/constants'
import { ControlButton } from '~/views/controlButton'

class HeaderStore {
  inputRef = null

  setInputRef = ref => (this.input = ref)

  focus = () => {
    this.inputRef && this.inputRef.focus()
  }

  focusInput = react(
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
    { log: false },
  )

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
export class OrbitHeader extends React.Component {
  handleKeyDown = e => {
    // up/down
    const { keyCode } = e
    if (keyCode === 38 || keyCode === 40) {
      e.preventDefault()
    }
  }

  hoverSettler = this.props.appStore.getHoverSettler({
    onHover: this.props.headerStore.hover,
  })

  render({ orbitStore, headerStore, after, theme }) {
    const headerBg = theme.base.background
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
        <title>
          <UI.Icon
            $searchIcon
            name="ui-1_zoom"
            size={20}
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
        <after if={after}>{after}</after>
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
      padding: 2,
      transition: 'all ease-in 300ms',
    },
    after: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      flexFlow: 'row',
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
      fontSize: 24,
      padding: [20, 10, 20, 36],
      // height: 54,
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
