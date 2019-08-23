import { findDOMNode } from 'slate'
import AutoReplace from 'slate-auto-replace'

export function getSpec(plugins, rules) {
  const schema = {
    marks: {},
    nodes: {},
    rules: rules,
  }
  const response = {
    schema,
    plugins: [],
  }

  // add to slate spec
  for (const plugin of plugins) {
    const { rules, plugins, marks, nodes } = plugin

    if (rules) {
      schema.rules = [...schema.rules, ...rules]
    }
    if (plugins) {
      response.plugins = [...response.plugins, ...plugins]
    }
    if (marks) {
      schema.marks = { ...schema.marks, ...marks }
    }
    if (nodes) {
      schema.nodes = { ...schema.nodes, ...nodes }
    }
  }

  return response
}
export { findDOMNode } from 'slate'
export { default as AutoReplace } from 'slate-auto-replace'

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
