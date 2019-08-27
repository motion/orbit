import { Editor, Node } from 'slate'

import { headingToSlug } from '../helpers/headingToSlug'

export function CollapsableHeadings() {
  const queries = {
    getPathForHeadingNode(editor: Editor, node: Node) {
      const slugish = headingToSlug(editor.value.document, node)
      return `${editor.props.id || window.location.pathname}#${slugish}`
    },
  }

  const commands = {
    showContentBelow(editor: Editor, node: Node) {
      return editor.updateContentBelow(node, false)
    },

    hideContentBelow(editor: Editor, node: Node) {
      return editor.updateContentBelow(node, true)
    },

    toggleContentBelow(editor: Editor, node: Node) {
      const collapsed = node.data.get('collapsed')
      const persistKey = editor.getPathForHeadingNode(node)

      if (collapsed) {
        localStorage.removeItem(persistKey)
        return editor.showContentBelow(node)
      } else {
        localStorage.setItem(persistKey, 'collapsed')
        return editor.hideContentBelow(node)
      }
    },

    updateContentBelow(editor: Editor, node: Node, hidden: boolean) {
      const { document } = editor.value

      editor.setNodeByKey(node.key, { data: { collapsed: hidden } })

      const headingLevel = parseInt(node.type.replace(/^heading/, ''), 10)
      let headingLevels = []

      for (let level = headingLevel; level > 0; level--) {
        headingLevels.push(`heading${level}`)
      }

      let active
      document.nodes.forEach(n => {
        if (active && headingLevels.includes(n.type)) {
          active = false
          return
        }
        if (active) {
          editor.setNodeByKey(n.key, { data: { ...n.data.toJS(), hidden } })
        }
        if (n === node) active = true
      })
    },
  }

  function onKeyDown(_ev: React.KeyboardEvent, editor: Editor, next: Function) {
    const { startBlock } = editor.value
    if (
      !startBlock ||
      !startBlock.type ||
      !startBlock.type.match(/heading/) ||
      !startBlock.data.get('collapsed')
    )
      return next()

    // editing a heading will always uncollapse the contents beneath as the persist
    // key is based on the slug which is based on the heading contents
    editor.toggleContentBelow(startBlock)
    return next()
  }

  function normalizeNode(node: Node, editor: Editor, next: Function) {
    if (node.object !== 'block') return next()

    if (node.type.match(/heading/)) {
      const collapsed = node.data.get('collapsed')
      const persistKey = editor.getPathForHeadingNode(node)
      const persistedState = localStorage.getItem(persistKey)
      const shouldBeCollapsed = persistedState === 'collapsed'

      // ensures that on load content under collapsed headings is correctly hidden
      if (shouldBeCollapsed && !collapsed) {
        return (editor: Editor) => {
          return editor.updateContentBelow(node, shouldBeCollapsed).setNodeByKey(node.key, {
            data: { collapsed: shouldBeCollapsed },
          })
        }
      }
    }

    return next()
  }

  return { queries, commands, normalizeNode, onKeyDown }
}
