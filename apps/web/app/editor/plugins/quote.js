import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import node from '~/editor/node'
import { createButton } from './helpers'

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

export default class QuotePlugin {
  name = QUOTE
  category = 'blocks'
  plugins = [replacer(/^(>)$/, QUOTE)]
  barButtons = [createButton('textquote', QUOTE)]
  nodes = {
    [QUOTE]: Quote,
  }
}
