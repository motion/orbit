import { BLOCKS } from '../constants'

export default {
  onKeyDown: (event, data, state) => {
    const { startBlock } = state

    console.log(startBlock.text)

    if (event.which === 13) {
      const node = state.selection.startKey

      // todo make next line not hashtag
      // console.log()

      // state.transform().getBlock()
    }
  },
}
