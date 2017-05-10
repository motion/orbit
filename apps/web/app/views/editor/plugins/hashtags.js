import AutoReplace from 'slate-auto-replace'

export default [
  AutoReplace({
    trigger: '#',
    before: /^$/,
    after: /^$/,
    transform: (transform, e, data, matches) => {
      return transform.setBlock({
        type: 'hashtags',
      })
    },
  }),
]
