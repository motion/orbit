import AutoReplace from 'slate-auto-replace'

export default class Markdown {
  name = 'markdown'
  plugins = [
    // hr
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.call(editList.transforms.wrapInList),
    }),
  ]
}
