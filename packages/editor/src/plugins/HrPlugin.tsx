import React from 'react'
import AutoReplace from 'slate-auto-replace'

import { BLOCKS } from './constants'
import node from './node'

const hr = props =>
  node(
    <hr contentEditable={false} style={{ background: '#000', height: 1 }} {...props.attributes} />,
  )

export class Separators {
  nodes = {
    [BLOCKS.HR]: hr,
  }
  plugins = [
    // bullet
    AutoReplace({
      trigger: 'enter',
      before: /^(-{3})$/,
      transform: transform => {
        return transform.setBlock({
          type: 'hr',
          isVoid: true,
        })
      },
    }),
  ]
}
