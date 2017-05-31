import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import node from '~/editor/node'

const { QUOTE } = BLOCKS

@node
@view
class Quote {
  render({ attributes, children }) {
    return <blockquote {...attributes}>{children}</blockquote>
  }

  static style = {
    blockquote: {
      borderLeft: `2px solid #ddd`,
      fontSize: 18,
      paddingLeft: 10,
      marginLeft: 0,
      marginRight: 0,
      fontStyle: 'italic',
    },
  }
}

const createButton = name => ({ editorStore }) => {
  return (
    <Button
      icon="textquote"
      onClick={(event: Event) => {
        event.preventDefault()
        const isActive = editorStore.state.blocks.some(
          block => block.type === QUOTE
        )
        editorStore.transform(t =>
          t.setBlock(isActive ? BLOCKS.PARAGRAPH : QUOTE)
        )
      }}
    />
  )
}

export default class QuotePlugin {
  name = QUOTE
  category = 'blocks'
  plugins = [replacer(/^(>)$/, QUOTE)]
  barButtons = [createButton(QUOTE)]
  contextButtons = [createButton(QUOTE)]
  nodes = {
    [QUOTE]: Quote,
  }
}
