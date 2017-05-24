import { BLOCKS } from '../constants'

export default {
  onKeyDown: (event, data, state) => {
    const { startBlock } = state

    const key = state.selection.startKey
    const curNode = state.document.nodes.findDescendant(x => x.key === key)

    console.log(key, curNode, curNode && curNode.text)

    if (event.which === 13) {
      // todo make next line not hashtag
      // console.log()
      // state.transform().getBlock()
    }
  },
}
