// @flow
import React from 'react'
import { view } from '~/helpers'
import { List, Popover } from '~/ui'
import { findDOMNode } from 'react-dom'
import { object } from 'prop-types'

@view.ui class ContextMenuTarget {
  static contextTypes = {
    contextMenu: object,
  }

  componentDidMount() {
    const node = findDOMNode(this)
    this.on(node, 'contextmenu', () => {
      this.context.contextMenu.setData(this.props.data)
    })
  }

  render({ data, children, ...props }) {
    return React.cloneElement(children, props)
  }
}

@view({
  store: class ContextMenuStore {
    event = null
    data = null

    clearMenu = () => {
      this.event = null
    }

    handleContext = (event: Event) => {
      this.event = event
    }
  },
})
class ContextMenu {
  static childContextTypes = {
    contextMenu: object,
  }

  getChildContext() {
    return {
      contextMenu: {
        setData: data => (this.props.store.data = data),
        getData: () => this.props.store.data,
        clearData: data => (this.props.store.data = null),
      },
    }
  }

  props: {
    inactive: ?Boolean,
  }

  node = null

  componentDidMount() {
    this.on(window, 'click', (event: Event) => {
      if (this.props.inactive) return
      if (this.props.store.event) {
        event.preventDefault()
        this.props.store.clearMenu()
      }
    })

    this.on(this.node, 'contextmenu', (event: Event) => {
      if (this.props.inactive) return
      event.preventDefault()
      this.props.store.handleContext(event)
    })
  }

  render({ children, inactive, options, store, ...props }) {
    return (
      <contextmenu ref={this.ref('node').set} {...props}>
        {children}
        <Popover
          if={store.event}
          open
          overlay="transparent"
          popoverStyle={{
            border: '1px solid #bbb',
            background: [240, 240, 240, 0.98],
            boxShadow: '2px 4px 11px rgba(0,0,0,0.25)',
            borderRadius: 4,
          }}
          escapable
          animation="slide 100ms"
          onClose={store.clearMenu}
          noArrow
          top={store.event.clientY + 20}
          left={store.event.clientX - 50}
        >
          <List
            controlled
            width={140}
            items={options}
            itemStyle={{
              padding: [0, 7, 0, 16],
              margin: [3, 0],
              fontWeight: 300,
              fontSize: 15,
              color: '#444',
              '&:hover': {
                background: '#5E95F7',
                color: 'white',
              },
            }}
            onSelect={item => item.onSelect(store.data, store.event)}
            getItem={item => ({
              primary: item.title,
            })}
          />
        </Popover>
      </contextmenu>
    )
  }
}

ContextMenu.Target = ContextMenuTarget

export default ContextMenu
