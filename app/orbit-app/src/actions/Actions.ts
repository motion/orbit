import { createContext } from 'react'

import { copyAppLink } from './copyAppLink'
import { createCustomApp } from './createCustomApp'
import { previousTab } from './previousTab'
import { setInitialPaneIndex } from './setInitialPaneIndex'
import { tearApp } from './tearApp'

export const defaultActions = {
  tearApp,
  previousTab,
  setInitialPaneIndex,
  createCustomApp,
  copyAppLink,
}

export const ActionsContext = createContext(defaultActions)
