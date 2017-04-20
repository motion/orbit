import { view, observable } from '~/helpers'
import TimeAgo from 'react-timeago'
import Router from '~/router'
import Poof from '~/views/poof'
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
    this.setTimeout(() => {
      this.title.focus()
      document.execCommand('selectAll', false, null)
    }, 10)
  }

  onEnter = doc => {
    doc.title = this.title.innerText
    doc.save()
    this.title.blur()
    this.props.onSaveTitle(doc)
  }

  render({
    doc,
    children,
    getRef,
    onSaveTitle,
    slanty,
    editable,
    after,
    ...props
  }) {
    // hack for now
    getRef && getRef(this)

    if (children) {
      return <doc {...props}>{children}</doc>
    }
    return (
      <doc {...props}>
        <title
          $editing={this.editing}
          ref={this.ref('title').set}
          contentEditable={this.editing}
          onClick={() => Router.go(doc.url())}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              e.preventDefault()
              this.onEnter(doc)
            }
          }}
        >
          {doc.title}
        </title>
        <meta if={false}>
          <author>{doc.author_id}</author>
          <TimeAgo minPeriod={10} date={doc.created_at} />
        </meta>
        <delete
          onClick={e => {
            e.stopPropagation()
            doc.delete()
            this.poof.puff()
          }}
        >
          x
          <Poof ref={ref => this.poof = ref} />
        </delete>

        <content if={editable}>
          <Editor inline doc={doc} />
        </content>

        {after}
      </doc>
    )
  }

  static style = {
    doc: {
      position: 'relative',
      borderRadius: 6,
      border: [1, [0, 0, 0, 0.1]],
      padding: 12,
      margin: [0, 10, 10, 0],
      color: '#333',
    },
    meta: {
      fontSize: 13,
      color: [0, 0, 0, 0.4],
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
  }

  static theme = {
    slanty: {
      doc: {
        '&:hover': {
          borderColor: '#333',
          transform: {
            rotate: `-1deg`,
            scale: `1.01`,
          },
        },
      },
    },

    editable: {
      doc: {
        width: 'calc(50% - 10px)',
        height: 200,
      },
    },
  }
}
