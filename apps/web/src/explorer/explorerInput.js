import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Editor } from 'slate'
import RightArrow from '~/views/rightArrow'
import Router from '~/router'

const FONT_SIZE = 16

const $para = {
  fontSize: FONT_SIZE,
  color: 'rgba(0,0,0,.8)',
  fontWeight: 400,
}

const $arrow = {
  opacity: 0.4,
  margin: [0, -2],
  transform: {
    scale: 0.7,
  },
}

@view.attach('explorerStore')
@view
class Para {
  render({ children }) {
    return (
      <p style={$para}>
        {children}
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
    const doc = node.data.get('doc')
    const { document } = explorerStore.editorState
    const nextKey = document.getNextSibling(node.key).key
    const isLast = document.nodes.last().nodes.last().key === nextKey
    const selected = explorerStore.selectedItemKey === node.key
    const hideArrow = !explorerStore.isCreatingNew && isLast

    const btnProps = {
      chromeless: true,
      icon: doc && doc.type === 'thread' ? 'paper' : '',
      spaced: true,
      size: 1,
      height: 24,
      padding: [0, 5],
      margin: [0, 2, 0, -4],
      fontSize: FONT_SIZE,
      highlight: selected,
      $active: selected,
      color: [0, 0, 0, 0.8],
      style: $para,
    }

    return (
      <span>
        <inner contentEditable={false}>
          <UI.Button
            {...btnProps}
            onClick={() =>
              doc ? Router.go(doc.url()) : explorerStore.onItemClick(node.key)}
          >
            {name}
          </UI.Button>
          <RightArrow if={!hideArrow} css={$arrow} animate={isLast} />
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
      marginLeft: -4,
    },
    last: {
      marginLeft: -4,
      // marginBottom: 1,
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
        <UI.Button
          iconSize={14}
          margin={6}
          marginTop={5}
          chromeless
          circular
          disabled={Router.path === '/'}
          color={[0, 0, 0, 0.4]}
          height={24}
          icon="home"
          onClick={() => Router.go('/')}
        />
        <RightArrow if={Router.path !== '/'} css={$arrow} />
        <space css={{ width: 10 }} />
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
