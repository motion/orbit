// Join together lists that don't have
// any blocks in-between
export default {
  match: node => {
    return node.kind == 'document'
  },
  validate: document => {
    const joinableNode = document.nodes.find((node, key) => {
      if (!['ol_list', 'ul_list'].includes(node.type)) {
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
  normalize: (transform, document, { joinableNode, previousNode }) => {
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
