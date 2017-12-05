import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Constants from '~/constants'

const BANNER_COLORS = {
  note: 'blue',
  success: 'green',
  error: 'red',
}

@view({
  store: class HeaderStore {
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
      oraStore.ui.setFocusBar(true)
      this.setTimeout(() => {
        oraStore.inputRef.focus()
      })
    }
  }

  onHeaderBlur = () => {
    this.props.oraStore.ui.setFocusBar(false)
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
      color: [255, 255, 255, 0.7],
      padding: 8,
      size: 16,
      hover: {
        color: [255, 255, 255, 1],
      },
      css: {
        marginLeft: -8,
      },
    }

    return (
      <UI.Theme name="dark">
        <header
          $focus={oraStore.ui.focusedBar && !oraStore.ui.collapsed}
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
              $disabled={!oraStore.ui.focusedBar}
              size={1}
              getRef={oraStore.ui.onInputRef}
              borderRadius={0}
              onBlur={this.onHeaderBlur}
              onChange={oraStore.onSearchChange}
              value={oraStore.textboxVal}
              borderWidth={0}
              background="transparent"
            />

            <UI.HoverGlow zIndex={-1} opacity={0.075} blur={60} />

            <title
              $$background={
                BANNER_COLORS[oraStore.banner && oraStore.banner.type]
              }
            >
              <titleText>
                <UI.Text ellipse size={0.9}>
                  {(oraStore.banner && oraStore.banner.message) ||
                    oraStore.stack.last.result.id ||
                    'Search'}
                </UI.Text>
              </titleText>
            </title>

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
                    name="f"
                    opacity={0.5}
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
                opacity={0.5}
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
      // borderBottom: [1, [255, 255, 255, 0.1]],
      transition: 'all ease-in 100ms',
      justifyContent: 'center',
      '& .icon': {
        transition: 'all ease-in 100ms',
        transform: 'scale(0.9)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.02],
      },
    },
    focus: {
      opacity: 1,
      height: Constants.ORA_HEADER_HEIGHT_FULL + 100,
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
    },
    title: {
      opacity: 0.28,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    titleText: {
      position: 'absolute',
      right: 81,
      left: 34,
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
    },
  }
}
