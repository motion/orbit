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
    {
      // on enter create a new paragraph, not a new title
      onKeyDown: (e, data, state) => {
        const { startBlock } = state
        const isEnter = e.which === 13

        if (startBlock.type !== BLOCKS.TITLE || !isEnter) return

        return state.transform().insertBlock('paragraph').apply()
      },
    },
  ]
}
