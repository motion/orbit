// enter inside a title/meta moves you to document

export default {
  onKeyDown: (e, data, state) => {
    const { startBlock } = state
    const isEnter = e.which === 13

    if (!isEnter) return
    if (!/^(title|meta)$/.test(startBlock.type)) {
      return
    }

    e.preventDefault()

    const firstBodyNode = state.document.nodes.get(2)

    return state
      .transform()
      .collapseToEndOf(firstBodyNode)
      .moveOffsetsTo(firstBodyNode.length)
      .apply()
  },
}
