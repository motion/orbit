import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Editor } from 'slate'
import RightArrow from '~/views/rightArrow'

const FONT_SIZE = 16

const $para = {
  fontSize: FONT_SIZE,
  color: 'rgba(0,0,0,.8)',
  fontWeight: 400,
  fontFamily: ['"Exo 2.0"', 'Helvetica', 'monospace'],
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
  render({ explorerStore, node }) {
    const name = node.data.get('name')
    const doc = explorerStore.editorState.document
    const nextKey = doc.getNextSibling(node.key).key
    const isLast = doc.nodes.last().nodes.last().key === nextKey
    const selected = explorerStore.selectedItemKey === node.key

    return (
      <span>
        <inner contentEditable={false}>
          <UI.Button
            chromeless
            onClick={() => explorerStore.onItemClick(node.key)}
            spaced
            size={1}
            height={24}
            padding={[0, 5]}
            fontSize={FONT_SIZE}
            highlight={selected}
            $active={selected}
            color={[0, 0, 0, 0.8]}
            style={$para}
          >
            {name}
          </UI.Button>
          <RightArrow $arrow animate={isLast} />
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
      // marginRight: 8,
    },
    arrow: {
      marginTop: 1,
      opacity: 0.4,
      transform: {
        scale: 0.85,
        x: 2,
      },
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
      <bar $blurred={!store.focused} $focused={store.focused}>
        <Editor
          placeholder={'search or create docs'}
          state={store.editorState}
          ref={store.ref('inputNode').set}
          onKeyDown={store.onKeyDown}
          onFocus={store.onFocus}
          onBlur={store.onBlur}
          onChange={store.onChange}
          schema={schema}
          style={{ width: '100%', marginBottom: 1 }}
        />
      </bar>
    )
  }

  static style = {
    bar: {
      // padding: 5,
      height: 38,
      flexFlow: 'row',
      flex: 1,
      alignItems: 'center',
      borderBottom: [1, '#e0e0e0', 'dotted'],
      // background: '#f2f2f2',
      // borderRadius: 6,
    },
    focused: {
      borderColor: '#ddd',
    },
    blurred: {
      // background: '#f2f2f2',
      // borderBottom: '1px solid #eee',
    },
  }
}
