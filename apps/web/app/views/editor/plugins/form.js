import AutoReplace from 'slate-auto-replace'

export default [
  AutoReplace({
    trigger: 'enter',
    before: /^\$([A-Za-z0-9 ]+)$/,
    after: /^$/,
    transform: (transform, e, data, matches) => {
      console.log(matches)
      return transform.setBlock({
        type: 'input',
        data: {
          variable: matches[1],
        },
      })
    },
  }),
]
