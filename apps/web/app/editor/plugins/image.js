import InsertImages from 'slate-drop-or-paste-images'
import { BLOCKS } from '~/editor/constants'
import { Raw } from 'slate'
import { Image } from '@jot/models'
import React from 'react'
import { Button } from '~/ui'
import { view } from '~/helpers'
import node from '~/editor/node'

const readFile = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.addEventListener('error', () => {
      reject(reader.error)
    })
    reader.readAsDataURL(file)
  })

class ImageNodeStore {
  src = null
  loading = false

  start() {
    this.watch(async () => {
      this.src = await this.getSrc(this.props.node.data)
    })
  }

  getSrc = async data => {
    if (data.get('file')) {
      const file = data.get('file')
      this.saveImage(file)
      return await readFile(file)
    } else if (data.get('imageId')) {
      const image: Image = await Image.get(data.get('imageId')).exec()
      const src = await image.getAttachment()
      return src
    }
  }

  saveImage = async file => {
    if (this.loading) return
    this.loading = true
    const { doc } = this.props.editorStore
    const image = await doc.addImage(file)
    // save ID to doc
    this.props.setData({ imageId: image._id })
    this.loading = false
  }
}

@node
@view({
  store: ImageNodeStore,
})
class ImageNode {
  render({ attributes, store, children }) {
    return (
      <image {...attributes}>
        <img if={store.src} src={store.src} />
        <loading contentEditable={false} if={!store.src}>
          loading...
        </loading>
      </image>
    )
  }

  static style = {
    img: {
      alignSelf: 'flex-start',
    },
  }
}

export default class ImagePlugin {
  name = 'image'
  category = 'blocks'

  barButtons = [() => <Button icon="media-image" tooltip="image" />]

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
  nodes = {
    [BLOCKS.IMAGE]: ImageNode,
  }
}
