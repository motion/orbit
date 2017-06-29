import React from 'react'
import { view, observable } from '@mcro/black'
import gradients from './helpers/gradients'
import { sample, memoize } from 'lodash'
import { Icon, Button } from '@mcro/ui'
import DocumentView from './index'
import sum from 'hash-sum'

const idToGradient = memoize(id => {
  const num = Math.abs(+sum(id || '').replace(/[^0-9]/g, '') || 5)
  const deg = Math.floor(Math.random() * 120)
  return { deg, colors: gradients[num % gradients.length].colors }
})

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
    onSaveTitle,
    list,
    slanty,
    readOnly,
    hideMeta,
    draggable,
    inline,
    after,
    height,
    bordered,
    style,
    ...props
  }) {
    const gradient = idToGradient(doc._id)

    return (
      <doc
        $$undraggable
        key={doc._id}
        className="Tilt-inner"
        style={{
          ...style,
          background: `linear-gradient(${gradient.deg}deg, ${gradient
            .colors[0]}, ${gradient.colors[1]})`,
        }}
        {...props}
      >
        <title if={list}>
          {doc.title}
        </title>

        <content>
          <DocumentView
            readOnly={readOnly}
            getRef={this.ref('editor').set}
            inline={inline}
            id={doc._id}
          />
        </content>

        <info if={!hideMeta}>
          <item $author>
            {doc.authorId}
          </item>
          <item onClick={this.navigate}>
            <Button chromeless icon="link" size={12} color="#fff" />
          </item>
          <item onClick={() => doc.delete()}>
            <Button chromeless icon="simple-remove" color="#fff" />
          </item>
        </info>

        {children}
      </doc>
    )
  }

  static style = {
    doc: {
      position: 'relative',
      color: '#fff',
      overflow: 'hidden',
      padding: 20,
    },
    content: {
      flex: 1,
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 13,
      cursor: 'pointer',
      position: 'relative',
    },
    item: {
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
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
