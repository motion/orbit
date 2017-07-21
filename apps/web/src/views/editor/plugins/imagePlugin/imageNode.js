import React from 'react'
import { Image } from '@mcro/models'
import { view, watch } from '@mcro/black'
import node from '~/views/editor/node'

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
  @watch src = () => this.getDataUrl(this.props.node.data)

  getDataUrl = async data => {
    if (data.get('file')) {
      const file = data.get('file')
      this.saveImage(file)
      return await readFile(file)
    } else if (data.get('imageId')) {
      const image = await Image.get(data.get('imageId')).exec()
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
export default class ImageNode {
  render({ attributes, store, children }) {
    return (
      <image {...attributes}>
        <img if={store.src} src={store.src} />
        <loading if={!store.src}>
          {children}
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
