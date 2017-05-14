import { BLOCKS } from '../constants'

export default [
  // # at start is a hashtag
  {
    match: node => {
      return node.type === BLOCKS.PARAGRAPH && node.kind === 'block'
    },
    validate: paragraph => {
      return paragraph.text && paragraph.text.slice(0, 1) === '#'
    },
    normalize: (transform, paragraph) => {
      return transform.setNodeByKey(paragraph.key, {
        type: BLOCKS.HASHTAG,
      })
    },
  },
]
