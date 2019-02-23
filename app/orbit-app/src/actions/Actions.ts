import { createContext } from 'react'
import { previousTab } from './previousTab'
import { setInitialPaneIndex } from './setInitialPaneIndex'
import { setupNewApp } from './setupNewApp'
import { tearApp } from './tearApp'

export const defaultActions = {
  tearApp,
  setupNewApp,
  previousTab,
  setInitialPaneIndex,
}

export const ActionsContext = createContext(defaultActions)
