export image from './image'
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

// ul_list and list_item are names decided by
// https://github.com/GitbookIO/slate-edit-list

export const ul_list = props => <ul {...props.attributes}>{props.children}</ul>

export const list_item = props => (
  <li {...props.attributes}>{props.children}</li>
)

export const hr = props => <hr />
