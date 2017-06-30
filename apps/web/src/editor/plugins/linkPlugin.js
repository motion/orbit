import PasteLinkify from 'slate-paste-linkify'
import React from 'react'
import { BLOCKS } from '~/editor/constants'
import { createButton } from './helpers'

const LinkNode = props => {
  const { data } = props.node
  const href = data.get('href')

  const onClick = e => {
    e.preventDefault()
    e.stopPropagation()
    const win = window.open(href, '_blank')
    win.focus()
  }

  return (
    <a
      style={{ color: 'blue' }}
      target="_blank"
      {...props.attributes}
      onClick={onClick}
      href={href}
    >
      {props.children}
    </a>
  )
}

export default class Link {
  name = 'link'
  category = 'marks'
  nodes = {
    [BLOCKS.LINK]: LinkNode,
  }
  barButtons = [
    createButton({ icon: 'link', type: BLOCKS.LINK, tooltip: 'Link' }),
  ]
  plugins = [
    PasteLinkify({
      type: BLOCKS.LINK,
    }),
  ]
}
