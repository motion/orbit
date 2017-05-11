import { node, view } from '~/helpers'
import TimeAgo from 'react-timeago'

@node
@view
export default class Meta {
  render({ node, children, editorStore, ...props }) {
    return (
      <span $hashtags>
        <span contentEditable={false} $fade $left>#</span>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
        <span $fade if={editorStore.doc} contentEditable={false}>
          <TimeAgo minPeriod={10} date={editorStore.doc.updatedAt} />
        </span>
      </span>
    )
  }

  static style = {
    hashtags: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 0,
    },
    left: {
      display: 'inline-block',
      width: 3,
      marginLeft: -13,
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
    fade: {
      fontSize: 12,
      opacity: 0.5,
    },
  }
}
