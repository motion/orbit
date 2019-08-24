import { BLOCKS } from '../../constants'
import TodoNode from './todoNode'

export class TodoPlugin {
  name = 'todo'
  category = 'blocks'

  nodes = {
    [BLOCKS.TODO]: TodoNode,
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
          return state
            .transform()
            .insertBlock('paragraph')
            .apply()
        }

        return state
          .transform()
          .insertBlock('todo', { data: { done: false } })
          .apply()
      },
    },
  ]
}