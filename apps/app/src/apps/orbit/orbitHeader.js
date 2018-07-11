import * as React from 'react'
import { view, react, attachTheme, on } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/stores'
import { ControlButton } from '../../views/ControlButton'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'

window.UI = UI

class HeaderStore {
  inputRef = null

  onInput = () => {
    this.props.orbitStore.onChangeQuery(this.inputRef.innerText)
  }

  focus = () => {
    if (!this.inputRef) return
    this.inputRef.current.focus()
    on(
      this,
      setTimeout(() => {
        this.inputRef.current.focus()
      }),
    )
  }

  focusInput = react(
    () => [
      App.orbitState.pinned || App.orbitState.docked,
      // use this because otherwise input may not focus
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
      if (!shown) throw react.cancel
      await when(() => Desktop.state.focusedOnOrbit)
      this.focus()
    },
  )

  onClickInput = () => {
    if (!App.orbitState.pinned && Desktop.isHoldingOption) {
      App.togglePinned()
    }
  }
}

@attachTheme
@view.attach('orbitStore', 'appStore')
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

  render({ orbitStore, headerStore, after, theme, showPin }) {
    const headerBg = theme.base.background
    return (
      <orbitHeader $headerBg={headerBg} {...this.hoverSettler.props}>
        <title>
          <UI.Icon
            $searchIcon
            name="ui-1_zoom"
            size={18}
            color={theme.base.color.alpha(0.2)}
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
            getRef={ref => (headerStore.inputRef = ref)}
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
    searchIcon: {
      paddingLeft: 6,
      margin: ['auto', 0],
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
