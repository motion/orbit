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
            console.log('bye bye mouse')
            App.lastClick = null
          }}
          background="#fff"
          overlay="transparent"
          closeOnClickWithin
          escapable
          open
          shadow
        >
          <List
            items={[
              { primary: 'Doc List', onClick: _ => _ },
              { primary: 'Image', onClick: _ => _ },
              { primary: 'Bullet List', onClick: _ => _ },
              { primary: 'Todo List', onClick: _ => _ },
            ]}
          />
        </Popover>
      </popovers>
    )
  }
}
