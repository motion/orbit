/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

function isReactElement(object: any) {
  return (
    typeof object === 'object' && object !== null && object.$$typeof === Symbol.for('react.element')
  )
}

/**
 * Recursively walks through all children of a React element and returns
 * the string representation of the leafs concatenated.
 */
const traverse = (node: Node, res = '') => {
  if (typeof node === 'string' || typeof node === 'number') {
    // this is a leaf, add it to the result string
    res += node
  } else if (Array.isArray(node)) {
    // traverse all array members and recursively stringify them
    return node.map(x => traverse(x, res)).join('')
  } else if (isReactElement(node)) {
    // node is a react element access its children an recursively stringify them
    // @ts-ignore
    const { children } = node.props
    if (Array.isArray(children)) {
      return children.map(x => traverse(x, res))
    } else {
      return traverse(children, res)
    }
  }
  return res
}

const cache = new WeakMap()

export function textContent(node: Node): string {
  const isObj = node && node.constructor.name === 'Object'
  if (isObj && cache.has(node)) return cache.get(node)
  const res = traverse(node)
  if (isObj) cache.set(node, res)
  return res
}
