import AutoReplace from 'slate-auto-replace'

export const replacer = (char, type, data = {}) =>
  AutoReplace({
    trigger: 'space',
    before: char, // /^(>)$/,
    transform: transform => {
      return transform.setBlock({ type, data })
    },
  })
