import React, { memo, useMemo } from 'react'
import { HotKeys, HotKeysProps } from 'react-hotkeys'

import { useShortcutStore } from '../Shortcut'

export const ListShortcuts = memo(({ keyMap, handlers, ...props }: Partial<HotKeysProps>) => {
  const shortcutStore = useShortcutStore()
  const innerHandlers = useMemo(() => {
    const emit = key => {
      shortcutStore.emit(key)
    }
    return {
      up: () => emit('up'),
      down: () => emit('down'),
      ...handlers,
    }
  }, [handlers])
  return (
    <HotKeys
      keyMap={{
        down: 'down',
        up: 'up',
        ...keyMap,
      }}
      style={hotKeyStyle}
      handlers={innerHandlers}
      {...props}
    />
  )
})
const hotKeyStyle = {
  flex: 'inherit',
}
