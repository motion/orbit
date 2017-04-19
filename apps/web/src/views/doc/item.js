import { view, observable } from 'helpers'
import TimeAgo from 'react-timeago'
import Router from 'router'
import Poof from '~/src/views/poof'
import React from 'react'

@view
export default class DocItem {
  @observable editing = false

  focus() {
    this.editing = true
    this.setTimeout(() => {
      this.title.focus()
      this.title.select()
    }, 10)
  }

  onEnter(doc) {
    doc.title = this.title.value
    doc.save()
    this.title.blur()
  }

  render({ doc, children, getRef, ...props }) {
    getRef && getRef(this)
    if (children) {
      return <doc {...props}>{children}</doc>
    }
    return (
      <doc onClick={() => Router.go(doc.url())} {...props}>
        <input
          $title
          $editing={this.editing}
          ref={this.ref('title').set}
          contentEditable={this.editing}
          defaultValue={doc.title}
          onKeyDown={e => e.keyCode === 13 && this.onEnter(doc)}
        />
        <author>by {doc.author_id}</author>
        <TimeAgo minPeriod={10} date={doc.created_at} />
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
      </doc>
    )
  }

  static style = {
    doc: {
      position: 'relative',
      borderRadius: 6,
      border: [1, [0, 0, 0, 0.1]],
      padding: 20,
      paddingBottom: 10,
      margin: [0, 10, 10, 0],
      color: '#333',
      cursor: 'pointer',
      '&:hover': {
        transform: {
          rotate: `-1deg`,
          scale: `1.01`,
        },
        // boxShadow: 'inset 0 0 1px #000',
        borderColor: [0, 0, 0, 0.2],
      },
    },
    author: {
      alignSelf: 'right',
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: 500,
      pointerEvents: 'none',
      borderColor: 'transparent',
    },
    editing: {
      pointerEvents: 'auto',
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
      '&:hover': {
        background: '#eee',
      },
    },
  }
}
