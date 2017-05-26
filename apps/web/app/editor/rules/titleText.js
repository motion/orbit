import { BLOCKS } from '../constants'

// enforce title always just text

export default {
  match: node => {
    return node.type === BLOCKS.TITLE && node.kind === 'block'
  },
  validate: titleBlock => {
    const hasMarks = titleBlock.getMarks().isEmpty()
    const hasInlines = titleBlock.getInlines().isEmpty()

    return !(hasMarks && hasInlines)
  },
  normalize: (transform, titleBlock) => {
    transform.unwrapInlineByKey(titleBlock.key)

    titleBlock.getMarks().forEach(mark => {
      titleBlock.nodes.forEach(textNode => {
        if (textNode.kind === 'text') {
          transform.removeMarkByKey(textNode.key, 0, textNode.text.length, mark)
        }
      })
    })

    return transform
  },
}
