import React from 'react'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import { createButton } from './helpers'
import QuoteNode from './quoteNode'

const { QUOTE } = BLOCKS

export default class QuotePlugin {
  name = QUOTE
  category = 'blocks'
  plugins = [replacer(/^(>)$/, QUOTE)]
  barButtons = [createButton('textquote', QUOTE)]
  nodes = {
    [QUOTE]: QuoteNode,
  }
}
