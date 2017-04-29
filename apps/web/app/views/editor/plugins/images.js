import InsertImages from 'slate-drop-or-paste-images'
import { Raw } from 'slate'

export default InsertImages({
  extensions: ['png', 'jpg', 'gif'],
  async applyTransform(transform, file) {
    console.log(file)
    return transform.insertBlock({
      type: 'text',
      nodes: [
        Raw.deserializeText(
          {
            kind: 'text',
            text: 'lorem',
          },
          { terse: true }
        ),
      ],
    })
  },
})
