import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class HeaderStore {
    downAt = Date.now()
    focused = false
  },
})
export default class OraHeader extends React.Component {
  onHeaderMouseDown = () => {
    this.props.store.downAt = Date.now()
  }

  onHeaderMouseUp = () => {
    const { homeStore, store } = this.props
    if (Date.now() - store.downAt < 200) {
      store.focused = true
      this.setTimeout(() => {
        homeStore.inputRef.focus()
      })
    }
  }

  onHeaderBlur = () => {
    this.props.store.focused = false
  }

  render({ store, homeStore }) {
    return (
      <header
        $focus={store.focused}
        onMouseDown={this.onHeaderMouseDown}
        onMouseUp={this.onHeaderMouseUp}
        $$draggable
      >
        <UI.Icon $searchIcon size={12} name="zoom" color={[255, 255, 255, 1]} />
        <UI.Input
          $searchInput
          $disabled={!store.focused}
          size={1}
          getRef={homeStore.onInputRef}
          borderRadius={0}
          onBlur={this.onHeaderBlur}
          onChange={homeStore.onSearchChange}
          value={homeStore.textboxVal}
          borderWidth={0}
          fontWeight={200}
          css={{
            fontWeight: 300,
            color: '#fff',
            fontSize: 20,
          }}
        />

        <title>
          <UI.Text size={0.8}>{homeStore.stack.last.result.type}</UI.Text>
        </title>

        <buttons
          css={{
            position: 'absolute',
            top: 0,
            right: 12,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <UI.Icon
            onClick={homeStore.hide}
            size={12}
            padding={[0, 10]}
            name="remove"
            color={[255, 255, 255, 0.5]}
            hover={{
              color: [255, 255, 255, 1],
              transformOrigin: 'right right',
              transform: {
                scale: 1.1,
              },
            }}
          />
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
