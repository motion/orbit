import { TEXT_TYPES, BLOCKS } from '../constants'

export default [
  // enforce first line as always title
  {
    match: node => node.kind == 'document',
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
  },
  // enforce second line not title
  {
    match: node => node.kind === 'document',
    validate: document => {
      const firstNode = document.nodes.first()
      if (firstNode && firstNode.type === BLOCKS.TITLE) {
        const secondNode = document.getNextSibling(firstNode.key)
        if (secondNode && secondNode.type === BLOCKS.TITLE) {
          return secondNode
        }
      }
      return null
    },
    normalize: (transform, document, secondNode) => {
      // take the next nodes type if possible
      const thirdNode = document.getNextSibling(secondNode.key)
      const thirdNodeValid =
        thirdNode && TEXT_TYPES.indexOf(thirdNode.type) !== -1

      // set to paragraph or third node type
      transform.setNodeByKey(secondNode.key, {
        type: thirdNodeValid ? thirdNode.type : BLOCKS.PARAGRAPH,
      })
    },
  },
]
