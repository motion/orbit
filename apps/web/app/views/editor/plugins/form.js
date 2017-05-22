import AutoReplace from 'slate-auto-replace'
import { Block, Raw } from 'slate'

export default [
  AutoReplace({
    trigger: 'enter',
    before: /^\$([A-Za-z0-9 ]+)$/,
    after: /^$/,
    transform: (transform, e, data, matches) => {
      return transform
        .removeNodeByKey(transform.state.startBlock.key)
        .insertBlock({
          type: 'input-block',
          nodes: [
            Block.create({
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
            }),
            Block.create({
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
            }),
          ],
          data: {
            variable: matches.before[1],
          },
        })
    },
  }),
]
