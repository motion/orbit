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
    const isParagraph =
      editorStore.selection.lastBlock &&
      editorStore.selection.lastBlock.type === BLOCKS.PARAGRAPH

    return (
      <popovers if={!editorStore.inline} contentEditable={false}>
        <Popover
          open
          if={editorStore.selection.lastNode}
          target={() => editorStore.selection.lastNode}
          towards="left"
          noArrow
          adjust={[40, 0]}
        >
          {/* add node */}
          <Popover
            if={isParagraph}
            target={
              <Button
                icon="add"
                iconSize={9}
                chromeless
                color={[0, 0, 0, 0.2]}
              />
            }
            background="#fff"
            closeOnClickWithin
            openOnClick
            escapable
            noArrow
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

          {/* edit node */}
          <Popover
            if={!isParagraph}
            target={<Button icon="dot" iconSize={9} />}
            background="#fff"
            closeOnClickWithin
            openOnClick
            escapable
            noArrow
            shadow
          >
            <List
              items={[
                {
                  primary: 'Edit',
                  onClick: _ => _,
                },
                {
                  primary: 'Delete',
                  onClick: _ => _,
                },
              ]}
            />
          </Popover>
        </Popover>
      </popovers>
    )
  }
}
