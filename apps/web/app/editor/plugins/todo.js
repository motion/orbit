import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { replacer } from '~/editor/helpers'

@node
@view
class Todo {
  toggle = () => {
    const { node: { data }, setData } = this.props

    const next = data.set('done', !data.get('done'))

    setData(next)
  }

  render({ node, children, ...props }) {
    const { data } = node

    return (
      <check contentEditable={false}>
        <span>
          <input
            type="checkbox"
            checked={data.get('done')}
            onChange={this.toggle}
          />
        </span>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
      </check>
    )
  }

  static style = {
    check: {
      flexFlow: 'row',
      alignItems: 'center',
      marginTop: 0,
    },
    content: {
      flex: 1,
      marginLeft: 5,
    },
  }
}

export default class TodoPlugin {
  nodes = {
    [BLOCKS.TODO]: Todo,
  }

  plugins = [
    // markdown todo
    replacer(/^(\[\])$/, 'todo', { done: false }),
    // todo
    {
      onKeyDown: (e, data, state) => {
        const { startBlock } = state
        const isEnter = e.which === 13

        if (startBlock.type !== 'todo' || !isEnter) return

        // hold command to toggle done
        if (e.metaKey) {
          return state
            .transform()
            .setBlock({ data: { done: !startBlock.data.get('done') } })
            .apply()
        }

        if (startBlock.length === 0) {
          return state.transform().insertBlock('paragraph').apply()
        }

        return state
          .transform()
          .insertBlock('todo', { data: { done: false } })
          .apply()
      },
    },
  ]
}
