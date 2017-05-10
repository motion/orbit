import { node, view } from '~/helpers'
import TimeAgo from 'react-timeago'

@node
@view
export default class Meta {
  render({ node, children, editorStore, ...props }) {
    return (
      <span $hashtags>
        <span $left contentEditable={false}>
          #
        </span>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
        <span $meta if={editorStore.doc}>
          <TimeAgo minPeriod={10} date={editorStore.doc.updatedAt} />
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
