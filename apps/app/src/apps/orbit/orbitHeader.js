import * as React from 'react'
import { view, react, attachTheme, on } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/stores'
import { ControlButton } from '../../views/ControlButton'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'

class HeaderStore {
  inputRef = React.createRef()
  iconHovered = false

  onInput = () => {
    this.props.orbitStore.onChangeQuery(this.inputRef.innerText)
  }

  focus = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return
    }
    this.inputRef.current.focus()
  }

  focusInput = react(
    () => [
      App.orbitState.pinned || App.orbitState.docked,
      // use this because otherwise input may not focus
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
      if (!shown) {
        throw react.cancel
      }
      this.focus()
      await when(() => Desktop.state.focusedOnOrbit)
      this.focus()
    },
    {
      log: false,
    },
  )

  focusInputOnClearQuery = react(
    () => App.state.query,
    query => {
      if (query) {
        throw react.cancel
      }
      this.focus()
    },
  )

  onClickInput = () => {
    if (!App.orbitState.pinned && Desktop.isHoldingOption) {
      App.togglePinned()
    }
  }

  onHoverIcon = () => {
    this.iconHovered = true
  }

  onUnHoverIcon = () => {
    this.iconHovered = false
  }

  goHome = () => {
    if (this.props.paneStore.activePane === 'home') {
      App.actions.closeOrbit()
    } else {
      if (App.state.query) {
        this.props.orbitStore.clearQuery()
      } else {
        this.props.paneStore.setActivePane('home')
      }
    }
  }
}

@attachTheme
@view.attach('orbitStore', 'appStore', 'paneStore')
@view.attach({
  headerStore: HeaderStore,
})
@view
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

  render({ paneStore, orbitStore, headerStore, after, theme, showPin }) {
    const headerBg = theme.base.background
    const isHome = paneStore.activePane === 'home'
    const { iconHovered } = headerStore
    return (
      <orbitHeader $headerBg={headerBg} {...this.hoverSettler.props}>
        <title>
          <UI.Icon
            name={
              isHome && iconHovered
                ? 'remove'
                : !isHome && iconHovered
                  ? 'home'
                  : 'ui-1_zoom'
            }
            size={18}
            color={theme.base.color}
            onMouseEnter={headerStore.onHoverIcon}
            onMouseLeave={headerStore.onUnHoverIcon}
            onClick={headerStore.goHome}
            height="100%"
            width={30}
            marginRight={-5}
            opacity={0.2}
            cursor="pointer"
            hover={{
              opacity: 1,
            }}
          />
          <HighlightedTextArea
            width="100%"
            fontWeight={300}
            fontSize={22}
            lineHeight="22px"
            padding={13}
            paddingLeft={20}
            border="none"
            display="block"
            background="transparent"
            value={orbitStore.query}
            highlight={words => {
              words
              return /\w+/g
            }}
            color={theme.base.color.alpha(0.8)}
            onChange={orbitStore.onChangeQuery}
            onFocus={orbitStore.onFocus}
            onBlur={orbitStore.onBlur}
            onKeyDown={this.handleKeyDown}
            ref={headerStore.inputRef}
            onClick={headerStore.onClickInput}
          />
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
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: [5, 16],
      transition: 'all ease-in 300ms',
      zIndex: 4,
    },
    after: {
      alignItems: 'center',
      flexFlow: 'row',
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
      justifyContent: 'stretch',
      alignItems: 'stretch',
    },
  }

  static theme = ({ borderRadius, theme }) => {
    return {
      orbitHeader: {
        borderTopRadius: borderRadius,
        background: theme.base.background,
      },
    }
  }
}
