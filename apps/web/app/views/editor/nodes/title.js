import { node, view } from '~/helpers'

@node
@view
export default class Title {
  render({ editorStore, children, node, attributes, ...props }) {
    const level = node.data.get('level')
    const Tag = props => React.createElement(`h${level}`, props)

    return (
      <Tag $title={level} $$style={editorStore.theme.title} {...attributes}>
        {children}
      </Tag>
    )
  }

  static style = {
    title: level => ({
      fontWeight: 400,
      fontSize: Math.floor(Math.log(12 / level) * 10),
    }),
  }
}
