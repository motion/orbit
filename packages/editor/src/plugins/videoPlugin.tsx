import { view } from '@o/black'
import React from 'react'
import { BLOCKS } from '~/views/editor/constants'
import { replacer } from '~/views/editor/helpers'
import node from '~/views/editor/node'

class VideoStore {}

@node
@view({
  store: VideoStore,
})
class VideoNode {
  render({ store, node: { data } }) {
    return (
      <div contentEditable={false}>
        <h5>im a video</h5>
      </div>
    )
  }

  static style = {}
}

export default class Video {
  name = 'video'
  nodes = {
    [BLOCKS.VIDEO]: VideoNode,
  }
  plugins = [replacer(/^(\-video)$/, 'video', {})]
}
