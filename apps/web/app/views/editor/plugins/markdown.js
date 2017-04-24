import AutoReplace from 'slate-auto-replace'

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
        type: 'h',
        data: { level },
      })
    },
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(-)$/,
    transform: transform => transform.setBlock('li').wrapBlock('ul'),
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
