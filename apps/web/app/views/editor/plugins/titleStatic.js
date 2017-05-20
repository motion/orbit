// enter inside a title/meta moves you to document

export default {
  onKeyDown: (e, data, state) => {
    const isEnter = e.which === 13

    // only start blocks and enter event
    if (!isEnter) return
    if (!/^(title)$/.test(state.startBlock.type)) {
      return
    }

    // e.preventDefault()

    const currentNodeIndex = state.document.nodes.indexOf(state.startBlock)
    const nextNode = state.document.nodes.get(currentNodeIndex + 1)

    console.log('nextNode', nextNode)

    // return state.transform().collapseToEndOf(nextNode).moveOffsetsTo(0).apply()
  },
}
