import InsertImages from 'slate-drop-or-paste-images'
import { Raw } from 'slate'
import { Image } from 'models'

export default InsertImages({
  extensions: ['png', 'jpg', 'gif'],
  async applyTransform(transform, file) {
    console.log(file)

    new FileReader().readAsBinaryString(file).onload(async file => {
      const image = await Image.create({
        name: file.name,
      })

      debugger
    })

    //.collapseToEndOfPreviousBlock()
    return transform.insertBlock({
      type: 'image',
      isVoid: true,
      data: { file },
    })
  },
})

function insertText() {
  transform.insertBlock({
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
}
