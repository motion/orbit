import { BLOCKS } from '../constants'

export default {
  onKeyDown(e, data, state, editor) {
    if (data.key === 'enter') {
      if (state.blocks.first().key === state.startBlock.key) {
        // save title
      }
    }
  },
}
