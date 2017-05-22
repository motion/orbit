import React from 'react'
import { node, view } from '~/helpers'
import { flatten, uniq } from 'lodash'
import TimeAgo from 'react-timeago'

@node
@view
export default class Meta {
  render({ node, children, editorStore, ...props }) {
    // todo make this a read only thing maybe
    return (
      <metabar
        contentEditable
        suppressContentEditableWarning
        $hashtags
        if={!editorStore.inline}
      >
        <span contentEditable={false} $fade $left>#</span>
        <span contentEditable suppressContentEditableWarning $content>
          {children}
        </span>
        <span contentEditable={false} $fade if={editorStore.doc}>
          <TimeAgo minPeriod={10} date={editorStore.doc.updatedAt} />
        </span>
      </metabar>
    )
  }

  static style = {
    metabar: {
      margin: [2, 0, 4, 0],
    },
    hashtags: {
      fontSize: 16,
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
      color: '#777',
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
      opacity: 0.2,
    },
  }
}
