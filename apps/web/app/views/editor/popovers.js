// @flow
import { view } from '~/helpers'
import { Button, Popover, List, Icon } from '~/ui'
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
  }

  render({ editorStore }) {
    return (
      <popovers if={!editorStore.inline} contentEditable={false}>
        <Popover
          open
          if={editorStore.selection.lastFocusedNode}
          target={() => editorStore.selection.lastFocusedNode}
          towards="left"
          adjust={[40, 0]}
        >
          <Popover
            target={<Button icon="dot" iconSize={9} onClick={this.open} />}
            background="#fff"
            closeOnClickWithin
            openOnClick
            escapable
            shadow
          >
            <List
              items={[
                {
                  primary: 'Paragraph',
                  onClick: this.insert(BLOCKS.PARAGRAPH),
                },
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
