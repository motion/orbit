import { Document } from '@jot/models'
import { sortBy, last, flatMap, flatten, random } from 'lodash'
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
  activeTask = null
  hideArchived = true
  inProgress = null

  sortMap = {}

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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const task = this.tasks[oldIndex]
    const newVal = this.tasks[newIndex].sort + (oldIndex < newIndex ? +1 : -1)
    this.sortMap = Object.assign({}, this.sortMap, { [task.key]: newVal })
  }

  onSetProgress = task => {
    this.inProgress = task
  }

  onSelect = task => {
    this.activeTask = task
  }

  onKeyDown = () => {}

  onHandleUpKey = () => {
    if (this.activeTask === null) {
      this.activeTask = this.tasks[0]
    } else {
      this.activeTask = this.tasks[this.activeIndex - 1]
    }
  }

  onHandleDownKey = () => {
    if (this.activeTask === null) {
      this.activeTask = last(this.tasks)
    } else {
      this.activeTask = this.tasks[this.activeIndex + 1]
    }
  }

  handleShortcut = action => {
    if (action === 'up' || action === 'k') this.onHandleUpKey()
    if (action === 'down' || action === 'j') this.onHandleDownKey()
    if (action === 'enter') Router.go(this.activeTask.doc.url())
  }

  get activeIndex() {
    return this.tasks.map(i => i.key).indexOf(this.activeTask.key)
  }

  get tasks() {
    let keys = 1

    const allTasks = sortBy(
      flatMap(this.docs || [], doc => {
        if (!doc.content.document) return []
        const tasks = doc.content.document.nodes
          .filter(node => {
            return node.type === 'ul_list'
          })
          .map(ul => {
            return ul.nodes.map(li => {
              const text = liToText(li)
              const key = keys++
              const sort = this.sortMap[key] || +new Date(doc.createdAt) + key

              return {
                text,
                sort,
                archive: li.data.archive || false,
                doc,
                key,
              }
            })
          })

        return flatten(tasks)
      }).filter(t => (this.inProgress ? t.key !== this.inProgress.key : true)),
      'sort'
    )

    if (this.hideArchived) {
      return allTasks.filter(t => !t.archive)
    }
    return allTasks
  }
}
