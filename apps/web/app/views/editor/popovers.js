import { view } from '~/helpers'
import { Popover, List } from '~/ui'
import App from '@jot/models'

@view
export default class Popovers {
  render({ editorStore }) {
    console.log('editorStore.lastClick', editorStore.lastClick)
    return (
      <popovers>
        <Popover
          if={editorStore.lastClick}
          top={editorStore.lastClick.y}
          left={editorStore.lastClick.x}
          onMouseLeave={() => {
            console.log('bye bye mouse')
            editorStore.lastClick = null
          }}
          background="#fff"
          overlay="transparent"
          closeOnClickWithin
          escapable
          open
          shadow
          noArrow
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
