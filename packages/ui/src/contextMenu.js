import * as React from 'react'
import { view, on } from '@mcro/black'
import { findDOMNode } from 'react-dom'
import { object } from 'prop-types'
import { List } from './List'
import { Popover } from './popover'

@view.ui
class ContextMenuTarget extends React.Component {
  static contextTypes = {
    contextMenu: object,
  }

  componentDidMount() {
    const node = findDOMNode(this)
    on(this, node, 'contextmenu', () => {
      this.context.contextMenu.setData(this.props.data)
    })
  }

  render({ children, ...props }) {
    return React.cloneElement(children, props)
  }
}

// export type Props = {
//   width: number,
//   children: React.Element<any>,
//   inactive?: Boolean,
//   options?: Object,
//   store?: ContextMenuStore,
// }

class ContextMenuStore {
  event = null
  data = null

  clearMenu = () => {
    this.event = null
  }

  handleContext = event => {
    this.event = event
  }
}

@view.attach({
  store: ContextMenuStore,
})
@view
export class ContextMenu extends React.Component {
  nodeRef = React.createRef()

  get node() {
    return this.nodeRef.current
  }

  static defaultProps = {
    width: 135,
  }

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

  componentDidMount() {
    on(this, window, 'click', event => {
      if (this.props.inactive) return
      if (this.props.store.event) {
        event.preventDefault()
        this.props.store.clearMenu()
      }
    })

    on(this, this.node, 'contextmenu', event => {
      if (this.props.inactive) return
      event.preventDefault()
      event.stopPropagation()
      this.props.store.handleContext(event)
    })
  }

  render({ inactive, width, children, options, store, ...props }) {
    return (
      <contextmenu ref={this.node} {...props}>
        {children}
        <Popover
          if={store.event}
          open
          overlay="transparent"
          theme="none"
          overflow="visible"
          borderWidth={0}
          borderRadius={7}
          closeOnEsc
          animation="slide 100ms"
          onClose={store.clearMenu}
          noArrow
          top={store.event.clientY - 8}
          left={store.event.clientX + width / 2 - 8}
        >
          <List
            controlled
            background="#F0F0F0"
            boxShadow={[
              '1px 5px 16px rgba(0,0,0,0.2)',
              'inset 0 0 0 0.5px #b5b5b5',
            ]}
            borderRadius={7}
            width={width}
            items={options}
            itemProps={{
              glint: true,
              borderRadius: 0,
              css: {
                padding: [3, 7, 3, 28],
                margin: [3, 0],
                fontWeight: 900,
                fontSize: 15,
                color: '#444',
              },
            }}
            onSelect={item => item.onSelect(store.data, store.event)}
            getItem={item => ({
              primary: item.title,
              glow: false,
              hover: { background: 'blue', color: '#fff !important' },
            })}
          />
        </Popover>
      </contextmenu>
    )
  }
}

ContextMenu.Target = ContextMenuTarget
