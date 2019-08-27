import React from 'react'

import { BLOCKS } from '../constants'
import { replacer } from '../helpers'
import { node } from '../node'

const VideoNode = node(({ node: { data } }) => {
  return (
    <div contentEditable={false}>
      <h5>im a video</h5>
    </div>
  )
})

export class VideoPlugin {
  name = 'video'
  nodes = {
    [BLOCKS.VIDEO]: VideoNode,
  }
  plugins = [replacer(/^(\-video)$/, 'video', {})]
}
