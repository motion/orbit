import { node, view } from '~/helpers'
import { flatten, uniq } from 'lodash'
import TimeAgo from 'react-timeago'

@node
@view
export default class Meta {
  render({ node, children, editorStore, ...props }) {
    return (
      <span $hashtags if={!editorStore.inline}>
        <span contentEditable={false} $fade $left>#</span>
        <span $content contentEditable suppressContentEditableWarning>
          {children}
        </span>
        <span if={node.text} $content $hiddenTags contentEditable={false}>
          {node.text
            .split(' ')
            .map((tag, i) => <tag key={i}>{tag} <outline /></tag>)}
        </span>
        <span $fade if={editorStore.doc} contentEditable={false}>
          <TimeAgo minPeriod={10} date={editorStore.doc.updatedAt} />
        </span>
      </span>
    )
  }

  static style = {
    hashtags: {
      fontSize: 30,
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 0,
      position: 'relative',
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
    hiddenTags: {
      position: 'absolute',
      top: 0,
      left: 0,
      whiteSpace: 'pre',
      userSelect: 'none',
    },
    tag: {
      display: 'inline-block',
      // background: 'orange',
      padding: 0,
      position: 'relative',
    },
    outline: {
      position: 'absolute',
      background: '#f2f2f2',
      top: 5,
      left: -5,
      right: 5,
      bottom: 5,
      zIndex: -1,
      hover: {
        background: '#eee',
        color: 'black',
      },
    },
    fade: {
      fontSize: 12,
      opacity: 0.5,
    },
  }
}
