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
  // enforce other lines not title
  {
    match: node => node.kind == 'document',
    validate: document => {
      const rest = document.nodes.slice(1)
      const isTopLevelTitle = node =>
        node.type === BLOCKS.TITLE && node.data.get('level') === 1
      if (rest.some(isTopLevelTitle)) {
        return rest.filter(isTopLevelTitle)
      }
      return null
    },
    normalize: (transform, document, titles) => {
      titles.forEach(node => {
        transform.setNodeByKey(node.key, {
          type: BLOCKS.PARAGRAPH,
          data: null,
        })
      })
    },
  },
]
