import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import { MARKS } from '~/editor/constants'
import { createButton } from './helpers'

const { ITALIC, BOLD, UNDERLINE } = MARKS

const createMarkButton = ({ icon, type }) => {
  const toggle = t => t.toggleMark(type)
  return createButton({
    icon,
    type,
    wrap: toggle,
    unwrap: toggle,
    isActive: state => state.marks.some(mark => mark.type === type),
  })
}

const buttons = [
  createMarkButton({ icon: 'textitalic', type: ITALIC }),
  createMarkButton({ icon: 'textbold', type: BOLD }),
  createMarkButton({ icon: 'textunderline', type: UNDERLINE }),
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
