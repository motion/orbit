import { findDOMNode } from 'react-dom'

type Target = string | (() => React$Children | React$Children)

// @flow
export default function getTarget(target: Target) {
  if (!target) {
    return null
  }
  switch (typeof target) {
    case 'string':
      return document.querySelector(target)
    case 'function':
      return findDOMNode(target())
  }
  try {
    return findDOMNode(target)
  } catch (e) {
    return target
  }
}
