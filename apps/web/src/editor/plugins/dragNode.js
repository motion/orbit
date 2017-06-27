export default class DragNode {
  onDropNode = (e, data, state, store) => {
    store.transform(state =>
      state
        .deselect()
        .removeNodeByKey(data.node.key)
        .select(data.target)
        .insertBlock(data.node)
    )
  }

  plugins = [
    {
      // handles dragging nodes around
      onDrop: (e, data, state, editor) => {
        switch (data.type) {
          case 'node':
            return this.onDropNode(e, data, state, editor.props.editorStore)
        }
      },
    },
  ]
}
