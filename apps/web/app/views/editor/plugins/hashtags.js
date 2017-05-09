import AutoReplace from 'slate-auto-replace'

export default [
  AutoReplace({
    trigger: 'space',
    before: /^(#)$/,
    transform: (transform, e, data, matches) => {
      return transform.setBlock({
        type: 'hashtags',
      })
    },
  }),
]
