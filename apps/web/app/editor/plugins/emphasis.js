import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import { MARKS } from '~/editor/constants'

const { ITALIC, BOLD, UNDERLINE } = MARKS

const createButton = (mark, icon) => ({ editorStore }) => {
  // TODO: show only on textual ndoes
  if (!editorStore.selection.selected) {
    return null
  }

  return <Button icon={icon} onClick={() => editorStore.toggleMark(mark)} />
}

const buttons = [
  createButton(ITALIC, 'textitalic'),
  createButton(BOLD, 'textbold'),
  createButton(UNDERLINE, 'textunderline'),
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
