import { BLOCKS } from '../constants'

// enforce first line as always title

export default {
  match: node => {
    return node.kind == 'document'
  },
  validate: document => {
    const firstNode = document.nodes.first()
    const isTitle = firstNode && firstNode.type === BLOCKS.TITLE
    return isTitle ? null : firstNode
  },
  normalize: (transform, document, firstNode) => {
    transform.setNodeByKey(firstNode.key, {
      type: BLOCKS.TITLE,
      data: { level: 1 },
    })
  },
}
