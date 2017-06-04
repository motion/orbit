import TrailingBlock from 'slate-trailing-block'
import { BLOCKS } from '~/editor/constants'
import { Popover, Button } from '~/ui'
import Highlighter from './helpers/highlighter'
import node from '~/editor/node'
import { createButton } from './helpers'

const paragraph = node(props => {
  const { editorStore } = props
  const text = props.children[0].props.node.text

  if (
    editorStore.find &&
    editorStore.find.length > 0 &&
    text.trim().length > 0
  ) {
    return (
      <Highlighter
        highlightClassName="word-highlight"
        searchWords={[editorStore.find.toLowerCase()]}
        sanitize={text => text.toLowerCase()}
        highlightStyle={{ background: '#ffd54f' }}
        textToHighlight={text}
      />
    )
  }

  return <p {...props.attributes} $$text>{props.children}</p>
})

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
  category = 'text'

  contextButtons = [
    () => (
      <Popover target={<Button icon="textbackground" />} openOnHover background>
        <row style={{ flexFlow: 'row' }}>
          <Button icon="textcolor" />
          <Button icon="textbackground" />
        </row>
      </Popover>
    ),
  ]

  barButtons = [
    createButton({ icon: 'text', type: BLOCKS.PARAGRAPH, tooltip: 'Text' }),
  ]

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
