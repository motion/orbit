import { Document } from '@jot/models'
import { flatMap, flatten, random } from 'lodash'
import merge from 'deepmerge'

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
  hideArchived = true

  onArchive = task => {
    const doc = this.docs.filter(doc => doc._id === task.doc._id)[0]

    // const { content } = task.doc
    // doc.content.document.nodes = doc.content.document.nodes.map(node => {
    const newNodes = doc.content.document.nodes.map(node => {
      if (node.type !== 'ul_list') return node
      node.nodes = node.nodes.map(li => {
        if (task.text === liToText(li)) {
          li.data.archive = !(li.data.archive || false)
        }
        return li
      })
      return node
    })
    // doc.content = Object.assign({}, doc.content)
    doc.content = merge(doc.content, { document: { nodes: newNodes } })
    doc.save(false)
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

    if (this.hideArchived) {
      return allTasks.filter(t => !t.archive)
    }
    return allTasks
  }
}
