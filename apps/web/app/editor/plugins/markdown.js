import AutoReplace from 'slate-auto-replace'

export default class Markdown {
  plugins = [
    // title
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
    // hr
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.call(editList.transforms.wrapInList),
    }),
  ]
}
