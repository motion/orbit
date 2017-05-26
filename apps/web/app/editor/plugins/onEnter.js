import { BLOCKS } from '../constants'

const newParagraph = state =>
  state.transform().splitBlock().setBlock(BLOCKS.PARAGRAPH).apply()

const onEnter = (event: KeyboardEvent, state) => {
  const { startBlock } = state
  const enterNewPara = [
    BLOCKS.HEADER,
    BLOCKS.QUOTE,
    BLOCKS.TITLE,
    BLOCKS.DOC_LIST,
  ]
  if (enterNewPara.filter(x => startsWith(startBlock.type, x)).length > 0) {
    e.preventDefault()
    return newParagraph(state)
  }
  return state
}

export default {
  onKeyPress(event: KeyboardEvent, data, state) {
    if (event.which === 13) {
      // return onEnter(event, state)
    }
    return state
  },
}
