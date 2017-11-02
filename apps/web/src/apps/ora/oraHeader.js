import * as React from 'react'
import { watch, view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

@view({
  store: class HeaderStore {
    downAt = Date.now()
    @watch userSettings = () => CurrentUser.user.settings
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

  selectBucket = (item, index) => {
    console.log('select', index, item)
  }

  render({ store, oraStore }) {
    const itemProps = {
      glow: false,
      chromeless: true,
      color: [255, 255, 255, 0.5],
    }

    const settings = store.userSettings || {}
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
              CurrentUser.user.mergeUpdate({
                settings: {
                  buckets: [...buckets, e.target.value || 'null'],
                },
              })
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

        <title>
          <UI.Text size={0.8}>{oraStore.stack.last.result.type}</UI.Text>
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
      height: 'auto',
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
      zIndex: 1000,
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
    },
    searchInput: {
      position: 'relative',
      padding: [8, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
