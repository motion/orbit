export link from './link'
export counter from './counter'
export quote from './quote'

const makeTag = tag => props => React.createElement(`${tag}`, props)

export const title = props => {
  const { attributes, children, node } = props
  const level = node.data.get('level')
  const fontSize = Math.floor(7 / (level || 3) * 7)
  const Tag = props =>
    React.createElement(`h${level}`, { ...props, style: { fontSize } })
  return <Tag {...attributes}>{children}</Tag>
}

export const paragraph = props => <p>{props.children}</p>

export const ul = props => <ul {...props.attributes}>{props.children}</ul>

export const li = props => <li {...props.attributes}>{props.children}</li>

export const hr = props => <hr />
