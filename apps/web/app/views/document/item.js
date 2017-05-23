import React from 'react'
import { view, observable } from '~/helpers'
import TimeAgo from 'react-timeago'
import Router from '~/router'
import { Icon } from '~/ui'
import Editor from '~/views/editor'

@view
export default class DocItem {
  static defaultProps = {
    onSaveTitle: _ => _,
  }

  editor = null

  focus = () => {
    if (this.editor) {
      this.editor.focus()
    }
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
    list,
    slanty,
    readOnly,
    hideMeta,
    draggable,
    after,
    height,
    bordered,
    ...props
  }) {
    // hack for now
    getRef && getRef(this)

    if (children) {
      return <doc {...props}>{children}</doc>
    }

    return (
      <doc $$undraggable {...props}>
        <title if={list}>
          {doc.title}
        </title>

        <content>
          <Editor
            readOnly={readOnly}
            getRef={this.ref('editor').set}
            inline
            id={doc._id}
          />
        </content>

        <info if={!hideMeta}>
          <nick />
          <item $author>{doc.authorId}</item>
          <item onClick={this.navigate}>
            <Icon name="link" size={12} color={[0, 0, 0, 0.5]} />
          </item>
          <item onClick={() => doc.delete()}>
            <Icon name="simple-remove" size={8} />
          </item>
        </info>
      </doc>
    )
  }

  static style = {
    doc: {
      position: 'relative',
      color: '#333',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
    },
    info: {
      padding: [6, 10],
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 13,
      cursor: 'pointer',
      color: [0, 0, 0, 0.4],
      position: 'relative',
    },
    item: {
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
      },
    },
    nick: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 30,
      height: 1,
      background: '#eee',
    },
    minibtn: {
      color: '#aaa',
      '&:hover': {
        color: 'purple',
      },
    },
  }

  static theme = {
    bordered: {
      doc: {
        background: '#fff',
        margin: [0, 5, 10, 5],
        borderRadius: 6,
        border: [1, 'dotted', [0, 0, 0, 0.1]],
      },
    },
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
