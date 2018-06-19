import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/stores'
import * as Constants from '~/constants'
import { ControlButton } from '~/views/controlButton'

class HeaderStore {
  inputRef = React.createRef()

  focus = () => {
    if (!this.inputRef || !this.inputRef.current) {
      console.error('no input')
      return
    }
    // weirdly this doesnt work but the querySelector does...
    // this.inputRef.current.focus()
    // document.execCommand('selectAll', false, null)
    document.querySelector('input').focus()
  }

  focusInput = react(
    () => [
      App.orbitState.pinned || App.orbitState.docked,
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
      if (!shown) throw react.cancel
      await when(() => Desktop.state.focusedOnOrbit)
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

  render({ orbitStore, headerStore, after, theme, showPin }) {
    const headerBg = theme.base.background
    return (
      <orbitHeader $headerBg={headerBg} {...this.hoverSettler.props}>
        <title>
          <UI.Icon
            $searchIcon
            name="ui-1_zoom"
            size={20}
            color={theme.base.color.alpha(0.2)}
          />
          <input
            value={orbitStore.query}
            size={1.25}
            $input
            background="transparent"
            onChange={orbitStore.onChangeQuery}
            onKeyDown={this.handleKeyDown}
            ref={headerStore.inputRef}
            onClick={headerStore.onClickInput}
            css={{
              color: theme.base.color.alpha(0.8),
            }}
          />
          <inputLn />
        </title>
        <after if={after}>{after}</after>
        <ControlButton
          if={showPin}
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
          css={{
            opacity: App.orbitState.hidden ? 0 : 1,
          }}
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
      padding: [0, 16],
      transition: 'all ease-in 300ms',
      zIndex: 2,
    },
    after: {
      alignItems: 'center',
      flexFlow: 'row',
    },
    // headerBg: background => ({
    //   background: `linear-gradient(${background
    //     .darken(0.03)
    //     .desaturate(0.5)}, transparent)`,
    // }),
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
      paddingLeft: 14,
      margin: 0,
    },
    input: {
      width: '100%',
      background: 'transparent',
      fontWeight: 300,
      fontSize: 24,
      padding: [20, 10, 20, 30],
      // height: 54,
      border: 'none',
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

  static theme = ({ borderRadius }, theme) => {
    console.log('borderRadius', borderRadius)
    return {
      orbitHeader: {
        borderTopRadius: borderRadius,
        background: theme.base.background,
      },
    }
  }
}
