import AutoReplace from 'slate-auto-replace'
import EditList from 'slate-edit-list'

const editList = EditList()

const replacer = (char, type) =>
  AutoReplace({
    trigger: 'space',
    before: char, // /^(>)$/,
    transform: (transform, e, data, matches) => {
      return transform.setBlock({ type, data: {} })
    },
  })

export default [
  replacer(/^(>)$/, 'quote'),
  replacer(/^(\$counter)$/, 'counter'),
  AutoReplace({
    trigger: 'space',
    before: /^(#{1,6})$/,
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
