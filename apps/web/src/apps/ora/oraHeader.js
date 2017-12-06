import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Constants from '~/constants'
import OraBanner from './oraBanner'

@view({
  store: class OraHeaderStore {
    downAt = Date.now()
  },
})
export default class OraHeader extends React.Component {
  handleHeaderMouseDown = () => {
    this.props.store.downAt = Date.now()
  }

  handleHeaderMouseUp = () => {
    const { oraStore, store } = this.props
    if (Date.now() - store.downAt < 200) {
      oraStore.ui.focusBar()
    }
  }

  handleInputBlur = () => {
    this.props.oraStore.ui.setBarFocus(false)
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
    e.stopPropagation()
    this.props.oraStore.hide()
  }

  preventPropagation = e => {
    e.stopPropagation()
  }

  render({ oraStore }) {
    if (!CurrentUser.user) {
      return null
    }
    const settings = CurrentUser.user.settings || {}
    const { buckets = ['Default'], activeBucket = 'Default' } = settings
    const bucketItems = [
      ...buckets.map(name => ({
        primary: name,
        icon: name === activeBucket ? 'check' : null,
      })),
      {
        children: (
          <UI.Input
            onEnter={e => {
              if (e.target.value) {
                CurrentUser.user.mergeUpdate({
                  settings: {
                    buckets: [...buckets, e.target.value],
                  },
                })
              }
            }}
            placeholder="Create..."
          />
        ),
      },
    ]

    const iconProps = {
      color: [255, 255, 255, 0.5],
      padding: 8,
      size: 16,
      hover: {
        opacity: 0.5,
        color: [255, 255, 255, 1],
      },
      css: {
        marginLeft: -8,
      },
    }

    return (
      <UI.Theme name="dark">
        <header
          $focus={oraStore.ui.barFocused && !oraStore.ui.collapsed}
          onMouseDown={this.handleHeaderMouseDown}
          onMouseUp={this.handleHeaderMouseUp}
          $$draggable
        >
          <contents>
            <leftSide>
              <UI.Icon name="zoom" {...iconProps} />
              <UI.Icon
                if={false && oraStore.stack.length > 1}
                name="arrominleft"
                onClick={this.handleBack}
                onMouseUp={this.preventPropagation}
                {...iconProps}
              />
            </leftSide>

            <UI.Input
              $searchInput
              $disabled={!oraStore.ui.barFocused}
              size={1}
              getRef={oraStore.ui.onInputRef}
              borderRadius={0}
              onBlur={this.handleInputBlur}
              onChange={oraStore.ui.handleSearchChange}
              value={oraStore.ui.textboxVal}
              borderWidth={0}
              background="transparent"
            />

            <UI.HoverGlow zIndex={-1} opacity={0.045} blur={60} />

            <OraBanner />

            <rightSide onMouseUp={this.preventPropagation}>
              <UI.Popover
                openOnHover
                delay={150}
                closeOnEsc
                overlay="transparent"
                theme="light"
                width={150}
                target={
                  <UI.Icon
                    {...iconProps}
                    name="bucket"
                    opacity={0.015}
                    onClick={e => {
                      e.stopPropagation()
                      oraStore.hide()
                    }}
                  />
                }
              >
                <UI.List items={bucketItems} onSelect={this.selectBucket} />
              </UI.Popover>
              <UI.Icon
                {...iconProps}
                opacity={0.1}
                name="gear"
                onClick={this.props.oraStore.actions.openSettings}
              />
              <UI.Icon
                {...iconProps}
                size={14}
                opacity={0.5}
                onClick={this.handleHide}
                name="remove"
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
      opacity: 0.85,
      zIndex: -1,
      height: Constants.ORA_HEADER_HEIGHT + 100,
      paddingBottom: 100,
      transition: 'all ease-in 100ms',
      justifyContent: 'center',
      '& .icon': {
        transition: 'all ease-in 100ms',
        transform: 'scale(0.95)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.02],
      },
    },
    focus: {
      opacity: 1,
      height: Constants.ORA_HEADER_HEIGHT_FULL + 100,
      '& .icon': {
        transform: 'scale(1.05)',
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
    searchInput: {
      position: 'relative',
      padding: [8, 25, 9],
      paddingLeft: 36,
      fontWeight: 300,
      fontSize: 20,
      color: '#fff',
    },
  }
}
