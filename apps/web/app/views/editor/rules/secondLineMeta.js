import { TEXT_TYPES, BLOCKS } from '../constants'

export default [
  // enforce second line as always meta
  {
    match: node => node.kind == 'document',
    validate: document => {
      const secondNode = document.nodes.get(1)
      const isMeta = secondNode && secondNode.type === BLOCKS.META
      return isMeta ? null : secondNode
    },
    normalize: (transform, document, secondNode) => {
      transform.setNodeByKey(secondNode.key, {
        type: BLOCKS.META,
      })
    },
  },
  // enforce other lines not meta
  {
    match: node => node.kind == 'document',
    validate: document => {
      // TODO; get index
      const afterMeta = document.nodes.slice(2)
      const hasExtraMetas = afterMeta.some(node => node.type === BLOCKS.META)

      if (hasExtraMetas) {
        return afterMeta.filter(node => node.type === BLOCKS.META)
      }

      return null
    },
    normalize: (transform, document, metaNodes) => {
      metaNodes.forEach(node => {
        transform.setNodeByKey(node.key, {
          type: BLOCKS.PARAGRAPH,
        })
      })
    },
  },
]
