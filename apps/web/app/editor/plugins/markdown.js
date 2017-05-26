import AutoReplace from 'slate-auto-replace'

export default class Markdown {
  plugins = [
    // hr
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.call(editList.transforms.wrapInList),
    }),
  ]
}
