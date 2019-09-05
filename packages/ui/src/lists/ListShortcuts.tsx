import React, { HTMLProps, memo, useCallback, useMemo } from 'react'

import { keyCode } from '../helpers/keycode'
import { useShortcutStore } from '../Shortcut'

export const ListShortcuts = memo((props: HTMLProps<HTMLDivElement>) => {
  const shortcutStore = useShortcutStore()
  return (
    <div
      style={hotKeyStyle}
      {...props}
      onKeyDown={useCallback(e => {
        const emit = key => {
          shortcutStore.emit(key)
        }
        const key = keyCode(e)
        switch (key) {
          case 'down':
            emit('down')
            break
          case 'up':
            emit('up')
            break
        }
      }, [])}
    />
  )
})

const hotKeyStyle = {
  flex: 'inherit',
}
