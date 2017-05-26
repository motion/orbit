import TrailingBlock from 'slate-trailing-block'
import { BLOCKS } from '~/editor/constants'
import node from '~/editor/node'

const paragraph = node(props => (
  <p {...props.attributes} $$style={{ fontSize: 18 }}>{props.children}</p>
))

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

export default class TextPlugin {
  name = 'text'
  plugins = [
    {
      onKeyPress(event: KeyboardEvent, data, state) {
        if (event.which === 13) {
          return onEnter(event, state)
        }
        return state
      },
    },
    TrailingBlock({
      type: 'paragraph',
    }),
  ]

  nodes = {
    [BLOCKS.PARAGRAPH]: paragraph,
  }
}
