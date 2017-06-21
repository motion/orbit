import { random, flatten } from 'lodash'
import merge from 'deepmerge'

const liToText = ({ nodes }) =>
  nodes
    .map(node => {
      if (node.type !== 'paragraph') return ''

      const text = node.nodes[0].ranges.map(i => i.text).join('')

      return text
    })
    .join(' ')

// returns new content
export const toggleTask = (content, name) => {
  const newNodes = content.document.nodes.map(node => {
    if (node.type !== 'ul_list') return node
    node.nodes = node.nodes.map(li => {
      if (name === liToText(li)) {
        li.data.archive = !(li.data.archive || false)
      }
      return li
    })
    return node
  })
  // doc.content = Object.assign({}, doc.content)
  return merge(content, { document: { nodes: newNodes } })
}

export const docToTasks = doc => {
  // start somewhere and increment from there
  let keys = random(0, 1000000)

  if (!doc.content.document) return []
  const tasks = doc.content.document.nodes
    .filter(node => {
      return node.type === 'ul_list'
    })
    .map(ul => {
      return ul.nodes
        .map(li => {
          const text = liToText(li)
          const key = keys++
          const sort = +new Date(doc.createdAt) // this.sortMap[key] || +new Date(doc.createdAt) + key

          if (text === '') return null

          return {
            text,
            sort,
            archive: li.data.archive || false,
            doc,
            key,
          }
        })
        .filter(val => val !== null)
    })

  return flatten(tasks)
}
