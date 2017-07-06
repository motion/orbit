import React from 'react'
import { view } from '@mcro/black'
import { Input, Icon, Button } from '@mcro/ui'
import { Editor } from 'slate'

const $para = {
  fontSize: 14,
  color: `rgba(0,0,0,.8)`,
}

const schema = {
  nodes: {
    paragraph: props => {
      if (!App.stores) return <p />
      const cmdr = App.stores.CommanderStore[0]
      const first = cmdr.value.indexOf('/') === -1

      // if we're in the first path, add margin to match button styles
      const styles = Object.assign({}, $para, first && { marginLeft: 10 })

      return (
        <p style={styles}>
          {props.children}
        </p>
      )
    },
    item: ({ node }) => {
      const { data } = node
      return <Item node={node} />
    },
  },
}
const between = (a, b, c) => {
  if (a >= b) return c >= b && c <= a
  if (a <= b) return c <= b && c >= a
  return a === c
}

@view
class Item {
  render({ node }) {
    const name = node.data.get('name')
    const inline = { userSelect: 'initial', display: 'inline' }
    if (!App.stores) return <h1>test</h1>
    const cmdr = App.stores.CommanderStore[0]
    const doc = cmdr.editorState.document
    const prevKey = doc.getPreviousSibling(node.key).key
    const nextKey = doc.getNextSibling(node.key).key

    const isLast = doc.nodes.last().nodes.last().key === nextKey
    const offset = doc.getOffset(node.key)
    const { focusOffset, focusKey, anchorOffset } = cmdr.editorState.selection
    const hasSelection = !cmdr.editorState.selection.isBlurred
    const selected =
      cmdr.editorState.focusInline &&
      cmdr.editorState.focusInline.key === node.key

    return (
      <span $last={isLast} contentEditable={false}>
        <Button
          chromeless
          onClick={() => cmdr.onItemClick(node.key)}
          spaced
          size={0.7}
          fontSize={14}
          highlight={selected}
          style={inline}
          color={[0, 0, 0, 0.8]}
        >
          {name}
        </Button>
        <Icon style={inline} size={10} name="arrow-min-right" />
      </span>
    )
  }

  static style = {
    last: {
      marginRight: 10,
    },
    slash: {
      display: 'inline',
      userSelect: 'none',
      pointerEvents: 'none',
      opacity: 0,
      width: 0,
    },
  }
}

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore: store }) {
    store.version

    return (
      <bar
        $$align="center"
        $blurred={!store.focused}
        $focused={store.focused}
        $$row
        $$flex
      >
        <Editor
          if={true || store.active}
          placeholder={'search or create docs'}
          state={store.editorState}
          ref={input => (store.input = input)}
          onKeyDown={store.onKeyDown}
          onFocus={store.onFocus}
          onBlur={store.onBlur}
          onChange={store.onChange}
          schema={schema}
          style={{ width: '100%' }}
        />
        <button
          if={false}
          onClick={() => {
            store.onCommitItem('test')
          }}
        >
          add
        </button>
      </bar>
    )
  }

  static style = {
    bar: {
      padding: 5,
    },
    focused: {
      border: '1px solid rgba(82, 139, 211, 1)',
      borderRadius: 5,
    },
    blurred: {
      border: '1px solid rgba(0, 0, 0, 0)',
      borderBottom: `1px solid #eee`,
    },
    input: {
      width: '100%',
      marginTop: 0,
    },
    highlight: {
      fontWeight: 'bold',
    },
  }
}
