import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Constants from '~/constants'
import OraBanner from './oraBanner'

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
class BucketsDropdown {
  cancelCrawler = () => {
    console.log('canceling')
    this.props.oraStore.crawler.stop()
  }

  render() {
    const settings = CurrentUser.user.settings || {}
    const { buckets = ['Default'], activeBucket = 'Default' } = settings
    return (
      <UI.Popover
        openOnHover
        delay={150}
        closeOnEsc
        overlay="transparent"
        theme="light"
        width={150}
        target={
          <UI.Icon
            key="icon-bucket"
            {...iconProps}
            name="bucket"
            opacity={0.015}
            onClick={this.handleBucketClick}
          />
        }
      >
        <UI.List
          key="bucket-list"
          items={[
            {
              children: 'Cancel crawler',
              onClick: this.cancelCrawler,
            },
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
          ]}
          onSelect={this.selectBucket}
        />
      </UI.Popover>
    )
  }
}

@view.attach('oraStore')
@view
export default class OraHeader extends React.Component {
  componentDidMount({ oraStore }) {
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
              getRef={oraStore.ui.handleInputRef}
              borderRadius={0}
              onBlur={this.handleInputBlur}
              onKeyDown={oraStore.ui.handleSearchKeyDown}
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
                opacity={oraStore.ui.state.pinned ? 0.8 : 0.4}
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
