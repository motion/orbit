// Join together lists that don't have
// any blocks in-between
export default {
  match: node => {
    return node.kind == 'document'
  },
  validate: document => {
    const joinableNode = document.nodes.find((node, key) => {
      if (!['ol', 'ul'].includes(node.type)) {
        return false
      }

      const previousNode = document.nodes.get(key - 1)
      if (!previousNode) {
        return false
      }

      return node.type === previousNode.type
    })

    if (joinableNode) {
      const previousNode = document.getPreviousSibling(joinableNode.key)
      return { previousNode, joinableNode }
    } else {
      return false
    }
  },
  normalize: (transform, document, nodes) => {
    const { joinableNode, previousNode } = nodes
    const joinableNodelistItems = joinableNode.nodes

    joinableNodelistItems.forEach((node, index) => {
      transform.moveNodeByKey(
        node.key,
        previousNode.key,
        previousNode.nodes.size + index
      )
    })
    return transform.removeNodeByKey(joinableNode.key)
  },
}
