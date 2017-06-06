import { Document } from '@jot/models'
import { flatMap, flatten, random } from 'lodash'

const liToText = ({ nodes }) =>
  nodes
    .map(node => {
      if (node.type !== 'paragraph') return ''

      const text = node.nodes[0].ranges.map(i => i.text).join('')

      return text
    })
    .join(' ')

export default class SidebarStore {
  docs = Document.recent()
  active = null

  onArchive = task => {
    const { content } = task.doc
    task.doc.content.document.nodes = content.document.nodes.map(node => {
      if (node.type !== 'ul_list') return node

      return node.nodes.map(li => {
        if (task.text === liToText(li)) {
          console.log('match!')
          li.data.archive = true //!(li.data.archive || false)
        }
        return li
      })
    })

    task.doc.save()
  }

  get tasks() {
    let keys = 1

    const allTasks = flatMap(this.docs || [], doc => {
      if (!doc.content.document) return []
      const tasks = doc.content.document.nodes
        .filter(node => {
          return node.type === 'ul_list'
        })
        .map(ul => {
          return ul.nodes.map(li => {
            const text = liToText(li)
            return { text, archive: li.data.archive || false, doc, key: keys++ }
          })
        })

      return flatten(tasks)
    })

    return allTasks
  }
}
