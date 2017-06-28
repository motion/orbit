import { view } from '@mcro/black'
import { replacer } from '~/editor/helpers'
import React from 'react'
import node from '~/editor/node'
import { BLOCKS } from '~/editor/constants'

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
