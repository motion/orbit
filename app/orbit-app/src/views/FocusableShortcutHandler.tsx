import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

type ShortcutSequence = string

type Props = {
  shortcuts: { [name: string]: ShortcutSequence }
  handlers: { [name: string]: (key: KeyboardEvent) => void }
  focused?: boolean
  style?: Object
  children?: React.ReactNode
}

export const FocusableShortcutHandler = ({ shortcuts, handlers, focused, ...props }: Props) => {
  return <HotKeys keyMap={shortcuts} handlers={handlers} focused={focused} {...props} />
}
