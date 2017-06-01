import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import AutoReplace from 'slate-auto-replace'
import { BLOCKS } from '~/editor/constants'

@node
@view.ui
class TitleNode {
  render({ editorStore, children, node, attributes, ...props }) {
    const level = node.data.get('level')
    const Tag = props => React.createElement(`h${level}`, props)

    return (
      <Tag
        $title={level}
        $title1={level === 1}
        $$style={editorStore.theme.title}
        {...attributes}
      >
        {children}
      </Tag>
    )
  }

  static style = {
    title: level => ({
      fontWeight: level < 5 ? 400 : 600,
      fontSize: Math.floor(Math.log(200 / level) * 5.5),
    }),
    title1: {
      fontSize: 14,
      textTransform: 'uppercase',
      color: [0, 0, 0, 0.5],
      marginBottom: 5,
    },
  }
}

export default class TitlePlugin {
  name = BLOCKS.TITLE
  category = 'blocks'

  nodes = {
    [BLOCKS.TITLE]: TitleNode,
  }

  plugins = [
    // title
    AutoReplace({
      trigger: 'space',
      before: /^(#{2,6})$/,
      transform: (transform, e, data, matches) => {
        const [hashes] = matches.before
        const level = hashes.length
        return transform.setBlock({
          type: 'title',
          data: { level },
        })
      },
    }),
    {
      // on enter create a new paragraph, not a new title
      onKeyDown: (e, data, state) => {
        const { startBlock } = state
        const isEnter = e.which === 13

        console.log('isEnter', isEnter, 'block', startBlock.type)

        if (startBlock.type !== BLOCKS.TITLE || !isEnter) return

        return state.transform().insertBlock('paragraph').apply()
      },
    },
  ]
}
