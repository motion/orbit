// @flow
import * as UI from '@o/ui'
import React from 'react'
import TrailingBlock from 'slate-trailing-block'
import { BLOCKS } from '~/views/editor/constants'
import node from '~/views/editor/node'

import { createButton } from './helpers'
import Highlighter from './helpers/highlighter'

const PARAGRAPH_STYLE = {
  fontSize: 17,
  lineHeight: '24px',
}

export const Paragraph = node(({ editorStore, children, node, attributes }) => {
  const text = children[0].props.node.text

  if (editorStore.find && editorStore.find.length > 0 && text.trim().length > 0) {
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
    <p
      className={editorStore.placeholder ? 'showPlaceholder' : ''}
      placeholder={editorStore.placeholder}
      style={PARAGRAPH_STYLE}
      {...attributes}
    >
      {children}
    </p>
  )
})

export default class TextPlugin {
  name = 'text'
  category = 'text'

  contextButtons = [
    () => (
      <UI.Popover target={<UI.Button icon="textbackground" />} openOnHover background="transparent">
        <UI.Row>
          <UI.Button theme="dark" icon="textcolor" />
          <UI.Button icon="textbackground" />
        </UI.Row>
      </UI.Popover>
    ),
  ]

  barButtons = [createButton({ icon: 'text', type: BLOCKS.PARAGRAPH, tooltip: 'Text' })]

  plugins = [
    {
      onKeyDown(event: KeyboardEvent, data, state) {
        if (event.which === 39) {
          const { text } = state.startBlock
          if (text.trim() === '') {
            const isRoot = state.document.getPath(state.startBlock.key).length === 1

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
