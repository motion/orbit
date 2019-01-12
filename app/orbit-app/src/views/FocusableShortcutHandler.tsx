import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

type ShortcutSequence = string | string[]

type Props = {
  shortcuts: { [name: string]: ShortcutSequence }
  handlers: { [name: string]: (key: KeyboardEvent) => void }
  focused?: boolean
  style?: Object
  children?: React.ReactNode
}

export const FocusableShortcutHandler = React.memo(({ shortcuts, handlers, ...props }: Props) => {
  return <HotKeys keyMap={shortcuts} handlers={handlers} {...props} />
})
