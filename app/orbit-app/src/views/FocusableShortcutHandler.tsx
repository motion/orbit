import { HotKeys } from '@mcro/react-hotkeys'
import * as React from 'react'

type ShortcutSequence = string | string[]

type Props = {
  shortcuts: { [name: string]: ShortcutSequence }
  handlers: { [name: string]: (key: KeyboardEvent) => void }
  focused?: boolean
  style?: Object
  children?: React.ReactNode
}

export default React.memo(function FocusableShortcutHandler({
  shortcuts,
  handlers,
  ...props
}: Props) {
  return <HotKeys keyMap={shortcuts} handlers={handlers} {...props} />
})
