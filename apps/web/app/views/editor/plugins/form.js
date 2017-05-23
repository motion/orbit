import AutoReplace from 'slate-auto-replace'
import { Block, Raw } from 'slate'

export default [
  AutoReplace({
    trigger: 'enter',
    before: /^\$([A-Za-z0-9 ]+)$/,
    after: /^$/,
    transform: (transform, e, data, matches) => {
      const label = Block.create({
        type: 'text',
        nodes: [
          Raw.deserializeText(
            {
              kind: 'text',
              text: 'test1',
            },
            { terse: true }
          ),
        ],
      })

      const input = Block.create({
        type: 'text',
        nodes: [
          Raw.deserializeText(
            {
              kind: 'text',
              text: 'test2',
            },
            { terse: true }
          ),
        ],
      })

      console.log('inserting2', label, input)

      return transform
        .removeNodeByKey(transform.state.startBlock.key)
        .insertBlock({
          type: 'input-block',
          nodes: [label, input],
          data: {
            variable: matches.before[1],
          },
        })
        .collapseToEndOf(label.key)
    },
  }),
]
