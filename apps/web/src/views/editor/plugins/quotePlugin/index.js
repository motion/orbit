import React from 'react'
import { BLOCKS } from '~/views/editor/constants'
import { replacer } from '~/views/editor/helpers'
import { createButton } from '../helpers'
import QuoteNode from './quoteNode'

const { QUOTE } = BLOCKS

export default class QuotePlugin {
  name = QUOTE
  category = 'blocks'
  plugins = [replacer(/^(>)$/, QUOTE)]
  barButtons = [
    createButton({ icon: 'textquote', type: QUOTE, tooltip: 'Quote' }),
  ]
  nodes = {
    [QUOTE]: QuoteNode,
  }
}
