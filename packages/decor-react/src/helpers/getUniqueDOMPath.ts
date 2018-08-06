import { findDOMNode } from 'react-dom'

function getElementIndex(node: Element) {
  var index = 0
  while ((node = node.previousElementSibling)) {
    index++
  }
  return index
}

export function getUniqueDOMPath(mountedComponent) {
  const node = findDOMNode(mountedComponent) as HTMLElement
  let name = `${mountedComponent.name}`
  let parent = node
  while (parent && parent instanceof HTMLElement && parent.tagName !== 'HTML') {
    name += parent.nodeName + getElementIndex(parent)
    parent = parent.parentNode as HTMLElement
  }
  return name
}
