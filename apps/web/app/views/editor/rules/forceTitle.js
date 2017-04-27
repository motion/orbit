export default {
  match: node => {
    return node.kind == 'document'
  },
  validate: document => {
    window.d = document
    const block = document.nodes.get(0)
    if (block.type !== 'title') {
      return { block }
    }
    return false
  },
  normalize: (transform, document, { block }) => {
    return transform.setNodeByKey(block.key, {
      type: 'title',
      data: { level: 1 },
    })
  },
}
