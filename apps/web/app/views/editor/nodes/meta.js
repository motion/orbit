import { node, view } from '~/helpers'
import { flatten, uniq } from 'lodash'
import TimeAgo from 'react-timeago'

@node
@view
export default class Meta {
  render({ node, children, editorStore, ...props }) {
    // todo make this a read only thing maybe
    return (
      <span $hashtags if={!editorStore.inline}>
        <span $fade $left>#</span>
        <span $content>
          {children}
        </span>
        <span if={node.text} $content $hiddenTags>
          {node.text
            .split(' ')
            .map((tag, i) => <tag key={i}>{tag} <outline /></tag>)}
        </span>
        <span $fade if={editorStore.doc}>
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
