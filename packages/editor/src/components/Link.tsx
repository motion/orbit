import * as React from 'react'

import { SlateNodeProps as Props } from '../types'

export function Link(props: Props) {
  const { attributes, node, children, editor, readOnly } = props
  const embed = node.data.get('embed')
  const Component = node.data.get('component')
  const href = node.data.get('href')

  if (embed && Component) {
    return <Component {...props} />
  }

  return (
    <a
      {...attributes}
      href={readOnly ? href : undefined}
      onClick={
        readOnly
          ? ev => {
              if (editor.props.onClickLink) {
                ev.preventDefault()
                editor.props.onClickLink(href)
              }
            }
          : undefined
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
