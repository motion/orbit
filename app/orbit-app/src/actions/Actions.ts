import { createContext } from 'react'
import { createCustomApp } from './createCustomApp'
import { previousTab } from './previousTab'
import { setInitialPaneIndex } from './setInitialPaneIndex'
import { setupNewApp } from './setupNewApp'
import { tearApp } from './tearApp'

export const defaultActions = {
  tearApp,
  setupNewApp,
  previousTab,
  setInitialPaneIndex,
  createCustomApp,
}

export const ActionsContext = createContext(defaultActions)
