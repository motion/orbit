// @flow
import { view } from '~/helpers'
import { List, Popover } from '~/ui'
import { Keys } from '~/stores'

@view({
  store: class ContextMenuStore {
    event = null

    clearMenu = () => {
      this.event = null
    }

    handleContext = (event: Event) => {
      this.event = event
    }
  },
})
export default class ContextMenu {
  props: {
    inactive: ?Boolean,
  }

  node = null

  componentDidMount() {
    this.addEvent(window, 'click', (event: Event) => {
      if (this.props.inactive) return
      if (this.props.store.event) {
        event.preventDefault()
        this.props.store.clearMenu()
      }
    })

    this.addEvent(this.node, 'contextmenu', (event: Event) => {
      if (this.props.inactive) return
      // allow disabling by holding shift for now (dev help)
      if (Keys.active.shift) return
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
            border: '1px solid #cfcfcf',
            background: '#f9f9f9',
            boxShadow: '2px 4px 11px rgba(0,0,0,0.2)',
            borderRadius: 5,
          }}
          escapable
          animation="slide 200ms"
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
              borderBottom: [1, '#ddd'],
              padding: [2, 7, 2, 18],
              fontWeight: 300,
              color: '#444',
              '&:hover': {
                background: 'blue',
                color: 'white',
              },
            }}
            onSelect={item => item.onSelect(store.event)}
            getItem={item => ({
              primary: item.title,
            })}
          />
        </Popover>
      </contextmenu>
    )
  }
}
