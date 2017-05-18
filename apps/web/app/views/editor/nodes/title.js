import { node, view } from '~/helpers'

@node
@view
export default class Title {
  render({ editorStore, children, node, attributes, ...props }) {
    const level = node.data.get('level')
    const fontSize = Math.floor(6 / (level || 3) * 4.5)
    const Tag = props =>
      React.createElement(`h${level}`, {
        ...props,
        style: { fontSize, ...editorStore.theme.title },
      })
    return <Tag {...attributes}>{children}</Tag>
  }
}
