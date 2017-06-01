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
