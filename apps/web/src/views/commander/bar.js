import React from 'react'
import { view } from '@mcro/black'
import { Input, Icon, Button } from '@mcro/ui'
import { Editor } from 'slate'

const $para = {
  fontSize: 14,
  color: 'rgba(0,0,0,.8)',
}

@view.attach('commanderStore')
@view
class Para {
  render({ commanderStore, ...props }) {
    const first = commanderStore.value.indexOf('/') === -1

    // if we're in the first path, add margin to match button styles
    const styles = Object.assign({}, $para, first && { marginLeft: 10 })

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

@view({
  store: class {
    rendered = false

    start() {
      setTimeout(() => (this.rendered = true), 0)
    }
  },
})
class Arrow {
  render({ store, animate }) {
    return (
      <arrow>
        <Icon
          $animate={animate}
          $animateAfter={animate && store.rendered}
          $icon
          size={10}
          name="arrow-min-right"
        />
      </arrow>
    )
  }

  static style = {
    arrow: {
      display: 'inline-block',
    },
    icon: {
      display: 'inline-block',
      marginTop: 10,
    },
    animate: {
      transition: 'all 100ms ease-in',
      transform: `scale(0.6) translateX(-5px)`,
      opacity: 0.2,
    },
    animateAfter: {
      opacity: 1,
      transform: `scale(1) translateX(0px)`,
    },
  }
}

@view.attach('commanderStore')
@view
class Item {
  render({ commanderStore: cmdr, node }) {
    const inline = { userSelect: 'initial', display: 'inline' }
    const name = node.data.get('name')
    const doc = cmdr.editorState.document
    const nextKey = doc.getNextSibling(node.key).key
    const isLast = doc.nodes.last().nodes.last().key === nextKey
    const selected = cmdr.selectedItemKey === node.key

    return (
      <div>
        <span
          style={{ display: 'inline' }}
          $last={isLast}
          contentEditable={false}
        >
          test
          <Button
            chromeless
            onClick={() => cmdr.onItemClick(node.key)}
            spaced
            style={{ margin: 0, height: 20 }}
            size={0.7}
            fontSize={14}
            highlight={selected}
            style={inline}
            color={[0, 0, 0, 0.8]}
          >
            {name}
          </Button>
          <Arrow if={false} animate={isLast} />
        </span>
        <span style={{ height: 1 }} />
      </div>
    )
  }

  static style = {
    last: {
      marginRight: 8,
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
      borderBottom: '1px solid #eee',
    },
    highlight: {
      fontWeight: 'bold',
    },
  }
}
