import * as React from 'react'
import { FocusableShortcutHandler } from '../../views/FocusableShortcutHandler'

export const MultiSelectTableShortcutHandler = ({
  shortcuts = null,
  handlers = {
    enter: _ => _,
  },
  children,
}) => {
  return (
    <FocusableShortcutHandler
      shortcuts={{
        enter: 'enter',
        ...shortcuts,
      }}
      handlers={handlers}
    >
      {children}
    </FocusableShortcutHandler>
  )
}
