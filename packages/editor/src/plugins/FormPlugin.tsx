import React from 'react'
import { Block, Raw } from 'slate'
import AutoReplace from 'slate-auto-replace'

import { BLOCKS } from './constants'
import node from './node'

@node
const InputNode = node(({ childen }) => {
  return (
    <div>
      <text contentEditable suppressContentEditableWarning {...props.attributes}>
        {children}
      </text>
    </div>
  )
})

// static style = {
//   root: {
//     borderBottom: [2, 'blue'],
//     color: '#777',
//     padding: [6, 10],
//     fontSize: 16,
//   },
//   label: {
//     width: 100,
//     textAlign: 'right',
//   },
//   text: {},
// }

const plugins = [
  AutoReplace({
    trigger: 'enter',
    before: /^\$([A-Za-z0-9 ]+)$/,
    after: /^$/,
    transform: (transform, e, data, matches) => {
      const label = Block.create({
        type: 'label',
        nodes: [
          Raw.deserializeText(
            {
              kind: 'text',
              text: matches.before[1],
            },
            { terse: true },
          ),
        ],
      })

      const input = Block.create({
        type: 'input',
      })

      console.log('insert label', label)

      const result = transform
        .removeNodeByKey(transform.state.startBlock.key)
        .insertBlock({
          type: 'input-block',
          nodes: [label, input],
        })
        .collapseToStartOf(label)
        .extendForward(label.length)

      return result
    },
  }),

  // move from label to input on enter
  {
    onKeyDown: (e, data, state) => {
      const isEnter = e.which === 13

      if (state.startBlock.type === BLOCKS.LABEL) {
        if (isEnter) {
          e.preventDefault()

          const parent = state.document.getParent(state.startBlock.key)
          const currentNodeIndex = state.document.nodes.indexOf(parent)
          const nextNode = state.document.nodes.get(currentNodeIndex + 1)

          return state
            .transform()
            .collapseToStartOf(nextNode)
            .apply()
        }
      }

      if (state.startBlock.type === BLOCKS.INPUT) {
        if (isEnter) {
          e.preventDefault()

          const parent = state.document.getParent(state.startBlock.key)

          const currentNodeIndex = state.document.nodes.indexOf(state.startBlock)
          const nextNode = state.document.nodes.get(currentNodeIndex + 1)

          console.log(parent)

          return state
            .transform()
            .collapseToStartOf(nextNode)
            .apply()
        }
      }
    },
  },
]

const LabelNode = props => (
  <label style={{ fontSize: 13 }} {...props.attributes}>
    {props.children}
  </label>
)

export class FormPlugin {
  name = 'form'
  category = 'blocks'

  plugins = plugins
  nodes = {
    [BLOCKS.INPUT]: InputNode,
    [BLOCKS.LABEL]: LabelNode,
  }
}
