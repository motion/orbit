import { findDOMNode } from 'react-dom'

export function getTarget(target) {
  if (!target) {
    return null
  }
  if (target instanceof HTMLElement) {
    return target
  }
  switch (typeof target) {
    case 'string':
      return document.querySelector(target)
    case 'function':
      return findDOMNode(target())
  }
  return target
}
