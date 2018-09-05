import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

type ShortcutSequence = string

type Props = {
  shortcuts: { [name: string]: ShortcutSequence }
  handlers: { [name: string]: (key: KeyboardEvent) => void }
  focused?: boolean
  children?: React.ReactNode
}

export const FocusableShortcutHandler = ({
  shortcuts,
  handlers,
  focused,
  children,
}: Props) => {
  return (
    <HotKeys
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      keyMap={shortcuts}
      handlers={handlers}
      focused={focused}
    >
      {children}
    </HotKeys>
  )
}
