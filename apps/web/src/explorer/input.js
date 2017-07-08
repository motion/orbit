import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Editor } from 'slate'
import Arrow from './arrow'

const $para = {
  fontSize: 14,
  color: 'rgba(0,0,0,.8)',
}

@view.attach('explorerStore')
@view
class Para {
  render({ explorerStore, ...props }) {
    const first = explorerStore.value.indexOf('/') === -1

    // if we're in the first path, add margin to match button styles
    const styles = Object.assign({}, $para, first && { marginLeft: 8 })

    return (
      <p style={styles}>
        {props.children}
      </p>
    )
  }
}

const schema = {
  nodes: {
    paragraph: props => <Para {...props} />,
    item: props => <Item {...props} />,
  },
}

@view.attach('explorerStore')
@view
class Item {
  render({ explorerStore: cmdr, node }) {
    const inline = { userSelect: 'initial', display: 'inline' }
    const name = node.data.get('name')
    const doc = cmdr.editorState.document
    const nextKey = doc.getNextSibling(node.key).key
    const isLast = doc.nodes.last().nodes.last().key === nextKey
    const selected = cmdr.selectedItemKey === node.key

    return (
      <span>
        <inner contentEditable={false}>
          <UI.Button
            chromeless
            onClick={() => cmdr.onItemClick(node.key)}
            spaced
            style={{ margin: 0, height: 20 }}
            size={0.7}
            fontSize={14}
            highlight={selected}
            style={inline}
            $active={selected}
            color={[0, 0, 0, 0.8]}
          >
            {name}
          </UI.Button>
          <Arrow animate={isLast} />
        </inner>
        <block contentEditable={false} $last={isLast}>
          {name}
        </block>
      </span>
    )
  }

  static style = {
    span: {
      display: 'inline',
      position: 'relative',
    },
    last: {
      marginRight: 8,
    },
    div: {
      position: 'relative',
    },
    block: {
      opacity: 0,
      background: 'green',
      pointerEvents: 'none',
      display: 'inline',
      paddingRight: 21,
      paddingLeft: 5,
    },
    active: {
      background: 'rgba(0,0,255,.05)',
    },
    inner: {
      position: 'absolute',
      flexFlow: 'row',
      left: 0,
      top: -3,
    },
  }
}

@view.attach('explorerStore')
@view
export default class ExplorerInput {
  render({ explorerStore: store }) {
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
          placeholder={'search or create docs'}
          state={store.editorState}
          ref={store.ref('inputNode').set}
          onKeyDown={store.onKeyDown}
          onFocus={store.onFocus}
          onBlur={store.onBlur}
          onChange={store.onChange}
          schema={schema}
          style={{ width: '100%' }}
        />
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
      background: '#f2f2f2',
      borderRadius: 5,
      // borderBottom: '1px solid #eee',
    },
    highlight: {
      fontWeight: 'bold',
    },
  }
}
