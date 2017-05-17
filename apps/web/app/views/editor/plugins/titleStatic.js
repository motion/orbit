// enter inside a title/meta moves you to document

export default {
  onKeyDown: (e, data, state) => {
    const isEnter = e.which === 13

    // only start blocks and enter event
    if (!isEnter) return
    if (!/^(title|meta)$/.test(state.startBlock.type)) {
      return
    }

    // if at end of block
    if (
      state.startOffset === state.endOffset &&
      state.endOffset === state.startBlock.length
    ) {
      if (state.startBlock.type === 'meta') {
        // allow insert
        return
      }
    }

    e.preventDefault()

    const currentNodeIndex = state.document.nodes.indexOf(state.startBlock)
    const nextNode = state.document.nodes.get(currentNodeIndex + 1)

    return state
      .transform()
      .collapseToEndOf(nextNode)
      .moveOffsetsTo(nextNode.length)
      .apply()
  },
}
