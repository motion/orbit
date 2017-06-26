import AutoReplace from 'slate-auto-replace'
import { findDOMNode } from 'slate'

export { findDOMNode } from 'slate'
export AutoReplace from 'slate-auto-replace'

export function findParent(document, key) {
  return document.nodes.find(node => node.findDescendant(x => x.key === key))
}

export function findParentNode(document, key) {
  return findDOMNode(findParent(document, key))
}

export const replacer = (char, type, data = {}) =>
  AutoReplace({
    trigger: 'space',
    before: char, // /^(>)$/,
    transform: transform => {
      return transform.setBlock({ type, data })
    },
  })
