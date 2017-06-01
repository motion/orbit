import InsertImages from 'slate-drop-or-paste-images'
import { BLOCKS } from '~/editor/constants'
import React from 'react'
import { Button } from '~/ui'
import { createButton } from './helpers'
import ImageNode from './imageNode'

export default class ImagePlugin {
  name = 'image'
  category = 'blocks'
  barButtons = [createButton('media-image', BLOCKS.IMAGE)]
  nodes = {
    [BLOCKS.IMAGE]: ImageNode,
  }
  plugins = [
    InsertImages({
      extensions: ['png', 'jpg', 'gif'],
      applyTransform(transform, file) {
        return transform.insertBlock({
          type: 'image',
          isVoid: true,
          data: { file },
        })
      },
    }),
  ]
}
