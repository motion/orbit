import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

const BANNER_COLORS = {
  note: 'blue',
  success: 'green',
  failure: 'red',
}

@view({
  store: class HeaderStore {
    downAt = Date.now()
  },
})
export default class OraHeader extends React.Component {
  onHeaderMouseDown = () => {
    this.props.store.downAt = Date.now()
  }

  onHeaderMouseUp = () => {
    const { oraStore, store } = this.props
    if (Date.now() - store.downAt < 200) {
      oraStore.focused = true
      this.setTimeout(() => {
        oraStore.inputRef.focus()
      })
    }
  }

  onHeaderBlur = () => {
    this.props.oraStore.focused = false
  }

  selectBucket = async item => {
    await CurrentUser.user.mergeUpdate({
      settings: {
        activeBucket: item.primary,
      },
    })
    console.log('set bucket', item.primary)
  }

  render({ oraStore }) {
    if (!CurrentUser.user) {
      return null
    }
    const itemProps = {
      glow: false,
      chromeless: true,
      color: [255, 255, 255, 0.5],
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

    return (
      <header
        $focus={oraStore.focused}
        onMouseDown={this.onHeaderMouseDown}
        onMouseUp={this.onHeaderMouseUp}
        $$draggable
      >
        <UI.Icon $searchIcon size={12} name="zoom" color={[255, 255, 255, 1]} />
        <UI.Input
          $searchInput
          $disabled={!oraStore.focused}
          size={1}
          getRef={oraStore.onInputRef}
          borderRadius={0}
          onBlur={this.onHeaderBlur}
          onChange={oraStore.onSearchChange}
          value={oraStore.textboxVal}
          borderWidth={0}
          fontWeight={200}
          css={{
            fontWeight: 300,
            color: '#fff',
            fontSize: 20,
          }}
        />

        <title
          $$background={BANNER_COLORS[oraStore.banner && oraStore.banner.type]}
        >
          <UI.Text size={0.8}>
            {(oraStore.banner && oraStore.banner.message) ||
              oraStore.stack.last.result.type}
          </UI.Text>
        </title>

        <buttons
          css={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            justifyContent: 'center',
          }}
          onMouseUp={e => {
            e.stopPropagation()
          }}
        >
          <UI.Row>
            <UI.Popover
              openOnHover
              delay={300}
              closeOnEsc
              overlay="transparent"
              theme="light"
              width={150}
              target={
                <UI.Button
                  {...itemProps}
                  icon="bucket"
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
            <UI.Button
              {...itemProps}
              onClick={e => {
                e.stopPropagation()
                oraStore.hide()
              }}
              icon="remove"
            />
          </UI.Row>
        </buttons>
      </header>
    )
  }

  static style = {
    header: {
      position: 'relative',
      opacity: 0.85,
      height: 30,
      transition: 'all ease-in 80ms',
      '& .icon': {
        transition: 'all ease-in 100ms',
        transform: 'scale(0.75)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.2],
      },
    },
    focus: {
      opacity: 1,
      height: 40,
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
    title: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    disabled: {
      pointerEvents: 'none',
    },
    searchIcon: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 12,
      zIndex: 2,
    },
    searchInput: {
      position: 'relative',
      padding: [8, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
