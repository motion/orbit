import { findDOMNode } from 'slate'

export { findDOMNode } from 'slate'

export function findParent(document, key) {
  return document.nodes.find(node => node.findDescendant(x => x.key === key))
}

export function findParentNode(document, key) {
  return findDOMNode(findParent(document, key))
}
