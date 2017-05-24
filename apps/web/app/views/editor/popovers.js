import { view } from '~/helpers'
import { Popover, List } from '~/ui'
import App from '@jot/models'
import { BLOCKS } from './constants'

@view
export default class Popovers {
  insert = (type: string, data) => (event: Event) => {
    const { editorStore } = this.props
    editorStore.lastClick = null
    editorStore.focus()
    setTimeout(() => {
      editorStore.state
        .transform()
        .setBlock({ type, data })
        .insertBlock({ type, data })
        .apply()
      editorStore.focus()
    }, 500)
  }

  render({ editorStore }) {
    return (
      <popovers>
        <Popover
          if={editorStore.lastClick}
          top={editorStore.lastClick.y}
          left={editorStore.lastClick.x}
          onMouseLeave={() => {
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
              {
                primary: 'Doc List',
                onClick: this.insert(BLOCKS.DOC_LIST, { type: 'card' }),
              },
              { primary: 'Image', onClick: this.insert(BLOCKS.IMAGE) },
              { primary: 'Bullet List', onClick: this.insert(BLOCKS.UL_LIST) },
              { primary: 'Todo List', onClick: this.insert(BLOCKS.OL_LIST) },
            ]}
          />
        </Popover>
      </popovers>
    )
  }
}
