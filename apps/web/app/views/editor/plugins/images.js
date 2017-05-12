import InsertImages from 'slate-drop-or-paste-images'
import { Raw } from 'slate'
import { Image } from '@jot/models'

export default InsertImages({
  extensions: ['png', 'jpg', 'gif'],
  applyTransform(transform, file) {
    return transform.insertBlock({
      type: 'image',
      isVoid: true,
      data: { file },
    })
  },
})
