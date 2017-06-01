import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import { MARKS } from '~/editor/constants'
import { createButton } from './helpers'

const { ITALIC, BOLD, UNDERLINE } = MARKS

const createMarkButton = (icon, mark) => {
  const toggle = t => t.toggleMark(mark)
  return createButton(icon, mark, {
    wrap: toggle,
    unwrap: toggle,
  })
}

const buttons = [
  createMarkButton('textitalic', ITALIC),
  createMarkButton('textbold', BOLD),
  createMarkButton('textunderline', UNDERLINE),
]

export default class EmphasisPlugin {
  name = 'emphasis'
  category = 'marks'

  // TODO onKeyDown

  contextButtons = buttons
  // contextButtons = buttons

  marks = {
    [ITALIC]: props => <em style={{ display: 'inline' }}>{props.children}</em>,
    [BOLD]: props => <strong>{props.children}</strong>,
    [UNDERLINE]: props => <u style={{ display: 'inline' }}>{props.children}</u>,
  }
}
