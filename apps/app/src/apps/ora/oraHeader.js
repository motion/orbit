import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Constants from '~/constants'
import OraBanner from './oraBanner'
import Screen from '@mcro/screen'
import whatKey from 'whatkey'

const iconProps = {
  color: [255, 255, 255, 0.5],
  padding: 8,
  size: 15,
  hover: {
    color: [255, 255, 255, 1],
  },
  css: {
    marginLeft: -8,
  },
}

@view.attach('oraStore')
@view
export default class OraHeader extends React.Component {
  componentDidMount({ oraStore }) {
    this.watchBarFocus()
    this.react(
      () => oraStore.ui.showOra,
      shown => {
        // is toggling to shown
        if (shown) {
          this.props.oraStore.ui.focusBar()
        }
      },
    )
  }

  watchBarFocus() {
    const { oraStore } = this.props
    let lastState = oraStore.ui.barFocused
    this.watch(() => {
      const { inputRef, barFocused } = oraStore.ui
      if (barFocused === lastState) return
      lastState = barFocused
      console.log('barfoucss', barFocused, inputRef)
      if (!inputRef) return
      if (barFocused) {
        inputRef.focus()
        inputRef.select()
      } else {
        inputRef.blur()
      }
    })
  }

  handleInputRef = ref => {
    if (ref && this.inputRef !== ref) {
      this.inputRef = ref
      this.props.oraStore.ui.inputRef = ref
      this.attachInputHandlers(ref)
      ref.focus()
    }
  }

  inputDisposables = []
  attachInputHandlers = ref => {
    // reset old ones before attaching new ones
    this.inputDisposables.map(x => x())
    const { ui } = this.props.oraStore
    this.inputDisposables = [
      this.on(ref, 'focus', ui.focusBar),
      this.on(ref, 'blur', ui.blurBar),
      this.on(ref, 'keydown', ui.emitKeyCode),
      this.props.oraStore.ui.attachTrap('bar', ref),
    ]
  }

  handleHeaderClick = e => {
    e.preventDefault()
    this.props.oraStore.ui.focusBar()
  }

  handleInputMouseDown = e => {
    e.preventDefault()
  }

  handleInputBlur = () => {
    this.props.oraStore.ui.blurBar()
  }

  selectBucket = async item => {
    await CurrentUser.user.mergeUpdate({
      settings: {
        activeBucket: item.primary,
      },
    })
    console.log('set bucket', item.primary)
  }

  handleBack = e => {
    e.preventDefault()
    e.stopPropagation()
    this.props.oraStore.stack.pop()
  }

  handleHide = e => {
    console.log('hide')
    e.stopPropagation()
    this.props.oraStore.ui.toggleHidden()
  }

  handleBucketClick = e => {
    e.stopPropagation()
    this.props.oraStore.ui.hide()
  }

  handleChange = e => {
    if (Screen.desktopState.keyboard.option) return
    this.props.oraStore.ui.setTextboxVal(e.target.value)
  }

  handleKeyDown = e => {
    const { ui } = this.props.oraStore
    // ignore if option down
    if (!Screen.desktopState.keyboard.option) return
    e.preventDefault()
    const { key, char } = whatKey(e)
    console.log('got', key, char)
    if (!key) {
      return
    }
    if (key === 'backspace') {
      ui.setTextboxVal(ui.textboxVal.slice(0, ui.textboxVal.length - 1))
    } else {
      if (key.length === 1) {
        ui.setTextboxVal((this.textboxVal += char))
      }
    }
  }

  preventPropagation = e => {
    e.stopPropagation()
  }

  render({ oraStore }) {
    if (!CurrentUser.user) {
      return null
    }
    return (
      <UI.Theme name="dark">
        <header
          $focus={oraStore.ui.barFocused && !oraStore.ui.collapsed}
          onClick={this.handleHeaderClick}
          onMouseDown={this.handleInputMouseDown}
          $$draggable
        >
          <contents>
            <leftSide>
              <UI.Icon name="zoom" {...iconProps} color="#fff" />
              <UI.Icon
                if={false && oraStore.stack.length > 1}
                name="arrominleft"
                onClick={this.handleBack}
                onMouseUp={this.preventPropagation}
                {...iconProps}
              />
            </leftSide>
            <UI.Input
              key="ora-input"
              $searchInput
              $searchFont
              size={1}
              getRef={this.handleInputRef}
              borderRadius={0}
              onBlur={this.handleInputBlur}
              onKeyDown={this.handleKeyDown}
              onChange={this.handleChange}
              value={oraStore.ui.textboxVal}
              borderWidth={0}
              background="transparent"
            />
            <UI.HoverGlow zIndex={-1} opacity={0.045} blur={60} />
            <OraBanner $searchFont />
            <rightSide onMouseUp={this.preventPropagation}>
              <BucketsDropdown if={false} />
              <UI.Icon
                if={false}
                {...iconProps}
                opacity={0.1}
                name="gear"
                onClick={oraStore.actions.openSettings}
              />
              <UI.Icon
                {...iconProps}
                opacity={Screen.state.pinned ? 0.8 : 0.4}
                name="pin"
                onClick={oraStore.ui.togglePinned}
              />
              <UI.Icon
                {...iconProps}
                size={12}
                color="#fff"
                opacity={0.15}
                padding={10}
                hover={{
                  opacity: 0.5,
                }}
                onClick={this.handleHide}
                name="right2"
              />
            </rightSide>
          </contents>
        </header>
      </UI.Theme>
    )
  }

  static style = {
    header: {
      position: 'relative',
      overflow: 'hidden',
      opacity: 0.9,
      zIndex: -1,
      height: Constants.ORA_HEADER_HEIGHT + 100,
      paddingBottom: 100,
      transition: 'all ease-in 100ms',
      justifyContent: 'center',
      '& .icon': {
        transition: 'all ease-in 100ms',
        // transform: 'scale(0.95)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.02],
      },
    },
    focus: {
      opacity: 1,
      // height: Constants.ORA_HEADER_HEIGHT_FULL + 100,
      '& .icon': {
        transform: 'scale(1)',
      },
      '& .title': {
        display: 'none',
      },
      '&:hover': {
        background: 'transparent',
      },
    },
    contents: {
      position: 'relative',
      flex: 1,
      justifyContent: 'center',
    },
    disabled: {
      pointerEvents: 'none',
    },
    leftSide: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      height: 'auto',
      left: 10,
      zIndex: 2,
      opacity: 0.5,
    },
    rightSide: {
      position: 'absolute',
      top: 0,
      right: 2,
      bottom: 0,
      zIndex: 1000,
      justifyContent: 'center',
      alignItems: 'center',
      flexFlow: 'row',
    },
    searchFont: {
      fontWeight: 300,
      fontSize: 18,
    },
    searchInput: {
      position: 'relative',
      padding: [8, 25, 9],
      paddingLeft: 36,
      color: '#fff',
    },
  }
}
