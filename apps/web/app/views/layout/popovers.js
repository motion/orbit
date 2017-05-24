import { view } from '~/helpers'
import { Popover, List } from '~/ui'
import App from '@jot/models'

@view
export default class Popovers {
  render() {
    return (
      <popovers>
        <Popover
          if={App.lastClick}
          top={App.lastClick.y}
          left={App.lastClick.x}
          onMouseLeave={() => {
            App.lastClick = null
          }}
          background="#fff"
          overlay
          escapable
          open
        >
          <List
            items={[
              { primary: 'Doc List' },
              { primary: 'Image' },
              { primary: 'Bullet List' },
              { primary: 'Todo List' },
            ]}
          />
        </Popover>
      </popovers>
    )
  }
}
