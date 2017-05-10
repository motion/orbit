import { TEXT_TYPES, BLOCKS } from '../constants'

export default [
  // enforce only one hashtags
  {
    match: node => node.kind == 'document',
    validate: document => {
      const tagNodes = document.nodes.some(node => node.type === 'hashtags')
      return tagNodes.length > 1 ? tagNodes : null
    },
    normalize: (transform, document, firstNode) => {
      transform.setNodeByKey(firstNode.key, {
        type: BLOCKS.PARAGRAPH,
        data: { level: 1 },
      })
    },
  },
]
