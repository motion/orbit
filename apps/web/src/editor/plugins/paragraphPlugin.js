// @flow
import React from 'react'
import TrailingBlock from 'slate-trailing-block'
import { BLOCKS } from '~/editor/constants'
import { Popover, Button } from '@mcro/ui'
import Highlighter from './helpers/highlighter'
import node from '~/editor/node'
import { createButton } from './helpers'

const PARAGRAPH_STYLE = {
  fontSize: 19,
  lineHeight: '27px',
}

export const Paragraph = node(
  ({ editorStore, children, inline, attributes }) => {
    const text = children[0].props.node.text
    const style = {
      ...PARAGRAPH_STYLE,
      color: inline ? '#fff' : 'auto',
    }

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
          style={style}
        />
      )
    }

    return (
      <p style={style} {...attributes} $$text>
        {children}
      </p>
    )
  }
)

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
    () =>
      <Popover target={<Button icon="textbackground" />} openOnHover background>
        <row style={{ flexFlow: 'row' }}>
          <Button theme="dark" icon="textcolor" />
          <Button icon="textbackground" />
        </row>
      </Popover>,
  ]

  barButtons = [
    createButton({ icon: 'text', type: BLOCKS.PARAGRAPH, tooltip: 'Text' }),
  ]

  plugins = [
    {
      onKeyDown(event: KeyboardEvent, data, state) {
        if (event.which === 39) {
          const { text } = state.startBlock
          if (text.trim() === '') {
            const isRoot =
              state.document.getPath(state.startBlock.key).length === 1

            if (isRoot) {
              return state
                .transform()
                .setBlock({ type: BLOCKS.INSERT, data: {} })
                .apply()
            }
          }
        }
        // return state
      },
    },
    TrailingBlock({
      type: BLOCKS.PARAGRAPH,
    }),
  ]

  nodes = {
    [BLOCKS.PARAGRAPH]: Paragraph,
  }
}
