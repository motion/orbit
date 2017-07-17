// @flow
import React from 'react'
import TrailingBlock from 'slate-trailing-block'
import { BLOCKS } from '~/editor/constants'
import * as UI from '@mcro/ui'
import Highlighter from './helpers/highlighter'
import node from '~/editor/node'
import { createButton } from './helpers'

const PARAGRAPH_STYLE = {
  fontSize: 18,
  lineHeight: '21px',
}

export const Paragraph = node(({ editorStore, children, attributes }) => {
  const text = children[0].props.node.text

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
        style={PARAGRAPH_STYLE}
      />
    )
  }

  return (
    <p style={PARAGRAPH_STYLE} {...attributes}>
      {children}
    </p>
  )
})

export default class TextPlugin {
  name = 'text'
  category = 'text'

  contextButtons = [
    () =>
      <UI.Popover
        target={<UI.Button icon="textbackground" />}
        openOnHover
        background="transparent"
      >
        <UI.Segment>
          <UI.Button theme="dark" icon="textcolor" />
          <UI.Button icon="textbackground" />
        </UI.Segment>
      </UI.Popover>,
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
