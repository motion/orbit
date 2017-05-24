// @flow
import { view } from '~/helpers'
import { Popover, List, Icon } from '~/ui'
import App from '@jot/models'
import { BLOCKS } from './constants'

@view.attach('editorStore')
@view
export default class Popovers {
  insert = (type: string, data: Object) => (event: Event) => {
    const { editorStore } = this.props
    editorStore.lastClick = null
    editorStore.editor.onChange(
      editorStore.editor
        .getState()
        .transform()
        .setBlock({ type, data })
        // .insertBlock({ type, data })
        .apply()
    )

    // editorStore.focus()
  }

  render({ editorStore }) {
    return (
      <popovers contentEditable={false}>
        <Popover
          open
          if={editorStore.selection.lastFocusedNode}
          target={() => editorStore.selection.lastFocusedNode}
          towards="left"
          adjust={[40, 0]}
        >
          <Popover
            target={<Icon button name="dot" size={9} onClick={this.open} />}
            background="#fff"
            closeOnClickWithin
            openOnClick
            escapable
            shadow
          >
            <List
              items={[
                {
                  primary: 'Doc List',
                  onClick: this.insert(BLOCKS.DOC_LIST, { type: 'card' }),
                },
                { primary: 'Image', onClick: this.insert(BLOCKS.IMAGE) },
                {
                  primary: 'Bullet List',
                  onClick: this.insert(BLOCKS.UL_LIST),
                },
                { primary: 'Todo List', onClick: this.insert(BLOCKS.OL_LIST) },
              ]}
            />
          </Popover>
        </Popover>
      </popovers>
    )
  }
}
