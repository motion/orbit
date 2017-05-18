// @flow
import { view } from '~/helpers'
import { List, Popover } from '~/ui'

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
          background
          shadow
          overlay="transparent"
          escapable
          animation="slide 200ms"
          onClose={store.clearMenu}
          noArrow
          top={store.event.clientY + 20}
          left={store.event.clientX - 50}
        >
          <List
            controlled
            width={206}
            items={options}
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
