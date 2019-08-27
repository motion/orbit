import React from 'react'
import InsertImages from 'slate-drop-or-paste-images'
import { BLOCKS } from '~/views/editor/constants'

import { createButton } from '../helpers'
import ImageNode from './imageNode'

export class ImagePlugin {
  name = 'image'
  category = 'blocks'
  barButtons = [createButton({ icon: 'media-image', type: BLOCKS.IMAGE, tooltip: 'Image' })]
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
