import AutoReplace from 'slate-auto-replace'
import EditList from 'slate-edit-list'
import { replacer } from '~/editor/helpers'

const editList = EditList()

export default [
  replacer(/^(\[\])$/, 'todo', { done: false }),
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
  AutoReplace({
    trigger: 'space',
    before: /^(-)$/,
    transform: transform => transform.call(editList.transforms.wrapInList),
  }),
  AutoReplace({
    trigger: 'enter',
    before: /^(-{3})$/,
    transform: transform => {
      return transform.setBlock({
        type: 'hr',
        isVoid: true,
      })
    },
  }),
]
