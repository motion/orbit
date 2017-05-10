import { node, view } from '~/helpers'

@node
@view
export default class Meta {
  render({ node, children, ...props }) {
    const { data } = node

    return (
      <span $hashtags>
        <div $left contentEditable={false}>
          #
        </div>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
      </span>
    )
  }

  static style = {
    hashtags: {
      display: 'flex',
      flexFlow: 'row',
    },
    left: {
      marginLeft: -10,
      marginRight: 10,
    },
    content: {
      flex: 1,
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      color: '#999',
    },
  }
}
