import { Button } from '@o/ui'
import React from 'react'

import { BLOCKS } from '../constants'

export const createButton = ({
  icon = null,
  type,
  tooltip = null,
  wrap = null,
  unwrap = null,
  isActive = null,
}) => ({ editorStore }) => {
  const active = Boolean(
    isActive ? isActive(editorStore.state) : editorStore.helpers.currentBlockIs(type),
  )

  return (
    <Button
      icon={icon}
      active={active}
      tooltip={tooltip}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()

        const action = active ? unwrap : wrap
        // allow passing in own wrap/unwrap
        editorStore.transform(t =>
          action ? action(t, editorStore) : t.setBlock(isActive ? BLOCKS.PARAGRAPH : type),
        )
        setTimeout(editorStore.focus)
      }}
    />
  )
}
