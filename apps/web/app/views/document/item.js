import { view, observable } from '~/helpers'
import TimeAgo from 'react-timeago'
import Router from '~/router'
import { Poof } from '~/ui'
import React from 'react'
import Editor from '~/views/editor'

@view
export default class DocItem {
  static defaultProps = {
    onSaveTitle: _ => _,
  }

  @observable editing = false

  focus = () => {
    this.editing = true
  }

  onEnter = doc => {
    doc.title = this.title.innerText
    doc.save()
    this.title.blur()
    this.props.onSaveTitle(doc)
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      this.onEnter(this.props.doc)
    }
  }

  navigate = () => Router.go(this.props.doc.url())

  render({
    doc,
    children,
    feed,
    getRef,
    onSaveTitle,
    slanty,
    editable,
    draggable,
    after,
    height,
    ...props
  }) {
    // hack for now
    getRef && getRef(this)

    if (children) {
      return <doc {...props}>{children}</doc>
    }

    return (
      <doc $$undraggable {...props}>
        <delete
          if={false}
          onClick={e => {
            e.stopPropagation()
            doc.delete()
            this.poof.puff()
          }}
        >
          x
          <Poof ref={ref => (this.poof = ref)} />
        </delete>

        <content if={editable}>
          <Editor inline id={doc._id} />
        </content>

        <info onClick={this.navigate}>
          <first>
            <author>{doc.authorId}</author>
            {after}
          </first>
        </info>
      </doc>
    )
  }

  static style = {
    doc: {
      position: 'relative',
      padding: 10,
      color: '#333',
      background: '#fff',
      overflow: 'hidden',
      borderRadius: 6,
      border: [1, [0, 0, 0, 0.1]],
      padding: 12,
      margin: [0, 5, 10, 5],
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      fontSize: 13,
      cursor: 'pointer',
      color: [0, 0, 0, 0.4],
      padding: 5,
    },
    title: {
      fontSize: 18,
      margin: [3, 0],
      display: 'block',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 500,
      cursor: 'pointer',
      borderColor: 'transparent',
      background: '-webkit-linear-gradient(right, purple, green)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    editing: {
      border: [1, '#eee'],
    },
    delete: {
      position: 'absolute',
      top: 2,
      right: 2,
      height: 16,
      width: 16,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 20,
      fontSize: 14,
      color: [0, 0, 0, 0.2],
      borderRadius: 1000,
      cursor: 'pointer',
      '&:hover': {
        background: '#eee',
      },
    },
    content: {
      flex: 1,
    },
    minibtn: {
      color: '#aaa',
      '&:hover': {
        color: 'purple',
      },
    },
  }

  static theme = {
    slanty: {
      doc: {
        // warning dont put transition effect here
        // messes up react-move-grid
        '&:hover': {
          borderColor: '#ddd',
          boxShadow: 'inset 0 0 0 1px #ddd',
          transform: {
            // rotate: `-0.5deg`,
            scale: `1.01`,
          },
        },
      },
    },
    feed: {
      doc: {
        width: '100%',
        margin: 0,
        marginBottom: 10,
      },
    },
    editable: {
      doc: {
        height: 200,
      },
    },
    draggable: {
      doc: {
        width: '100%',
        height: '100%',
        margin: 0,
      },
    },
    grid2: {
      doc: {
        width: 'calc(50% - 10px)',
      },
    },
  }
}
