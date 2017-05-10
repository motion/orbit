import { node, view } from '~/helpers'

@node
@view
export default class Hashtags {
  render({ node, children, ...props }) {
    const { data } = node

    return (
      <section $hashtags contentEditable={false}>
        <span $left>
          #
        </span>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
      </section>
    )
  }

  static style = {
    hashtags: {
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
