import { TEXT_TYPES, BLOCKS } from '../constants'

export default [
  // enforce first line as always title
  {
    match: node => node.kind == 'document',
    validate: document => {
      const firstNode = document.nodes.first()
      const isTitle =
        firstNode &&
        firstNode.type === BLOCKS.TITLE &&
        firstNode.data.get('level') === 1
      return isTitle ? null : firstNode
    },
    normalize: (transform, document, firstNode) => {
      return transform.setNodeByKey(firstNode.key, {
        type: BLOCKS.TITLE,
        data: { level: 1 },
      })
    },
  },
]
