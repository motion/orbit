import { view, observable, idFn } from 'helpers'
import TimeAgo from 'react-timeago'
import Router from 'router'
import Poof from '~/src/views/poof'
import React from 'react'
import Editor from '~/src/views/editor'

@view
export default class DocItem {
  static defaultProps = {
    onSaveTitle: idFn,
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

  render({ doc, children, getRef, onSaveTitle, slanty, editable, ...props }) {
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
          <Editor doc={doc} />
        </content>
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
      // cursor: 'pointer',
      '&:hover': {
        // boxShadow: 'inset 0 0 1px #000',
        borderColor: [0, 0, 0, 0.2],
      },
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
      top: 0,
      left: 0,
      height: 16,
      width: 16,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 20,
      fontSize: 12,
      color: [0, 0, 0, 0.35],
      borderRadius: 1000,
      cursor: 'pointer',
      '&:hover': {
        background: '#eee',
      },
    },
  }

  static theme = {
    slanty: {
      doc: {
        '&:hover': {
          transform: {
            rotate: `-1deg`,
            scale: `1.01`,
          },
        },
      },
    },

    editable: {
      doc: {
        width: 300,
        height: 300,
      },
    },
  }
}
