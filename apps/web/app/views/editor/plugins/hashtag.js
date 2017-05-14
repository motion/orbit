import { BLOCKS } from '../constants'
import getCurrentItem from './helpers/getCurrentItem'

export default {
  onKeyDown: (event, data, state) => {
    if (event.which === 13) {
      const node = state.selection.startKey

      // todo make next line not hashtag
      // console.log()

      // state.transform().getBlock()
    }
  },
}
