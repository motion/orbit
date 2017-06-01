import React from 'react'
import AutoReplace from 'slate-auto-replace'
import { BLOCKS } from '~/editor/constants'
import TitleNode from './titleNode'

export default class TitlePlugin {
  name = BLOCKS.TITLE
  category = 'blocks'

  nodes = {
    [BLOCKS.TITLE]: TitleNode,
  }

  plugins = [
    // title
    AutoReplace({
      trigger: 'space',
      before: /^(#{2,6})$/,
      transform: (transform, e, data, matches) => {
        const [hashes] = matches.before
        const level = hashes.length
        return transform.setBlock({
          type: 'title',
          data: { level },
        })
      },
    }),
  ]
}
