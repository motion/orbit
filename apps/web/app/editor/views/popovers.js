// @flow
import { view } from '~/helpers'
import { Button, Popover, List, Icon } from '~/ui'
import App from '@jot/models'
import { BLOCKS } from '~/editor/constants'

// todo: once plugins have contextual actions working
// we can automate these menus and pull them from there

@view.attach('editorStore')
@view
export default class Popovers {
  insert = (type: string, data: Object) => (event: Event) => {
    this.props.editorStore.transform(t => t.insertBlock({ type, data }))
  }

  insertList = () => {
    const { editorStore } = this.props

    return (
      <List
        items={[
          {
            primary: 'Doc List',
            onClick: this.insert(BLOCKS.DOC_LIST, { type: 'card' }),
          },
          {
            primary: 'Row',
            onClick: () =>
              editorStore.transform(t =>
                editorStore.allPlugins.row.insertRow(t)
              ),
          },
          { primary: 'Image', onClick: this.insert(BLOCKS.IMAGE) },
          {
            primary: 'Bullet List',
            onClick: this.insert(BLOCKS.UL_LIST),
          },
          {
            primary: 'Ordered List',
            onClick: this.insert(BLOCKS.OL_LIST),
          },
        ]}
      />
    )
  }

  render({ editorStore }) {
    const { isHovered, showEdit, showInsert } = editorStore.selection
    const showPopovers =
      (showEdit || showInsert) && editorStore.selection.hoveredNode

    return (
      <popovers if={!editorStore.inline} contentEditable={false}>
        <Popover
          if={showPopovers}
          target={() => editorStore.selection.hoveredNode}
          towards="left"
          noArrow
          adjust={[40, 0]}
          open
        >
          {/* add node */}
          <Popover
            if={showInsert}
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
            {this.insertList()}
          </Popover>

          {/* edit node */}
          <Popover
            if={showEdit}
            target={<Button icon="dot" iconSize={9} chromeless />}
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

            {this.insertList()}
          </Popover>
        </Popover>
      </popovers>
    )
  }
}
