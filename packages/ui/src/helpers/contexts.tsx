import * as React from 'react'

type UISegment = {
  first?: boolean
  last?: boolean
  index?: number
}

const uiContextDefault = {
  inSegment: null as UISegment | null,
  hovered: null as boolean | null,
}

export type UIContextType = typeof uiContextDefault

export const UIContext = React.createContext(uiContextDefault)

export const MergeUIContext = ({ value, children }) => (
  <UIContext.Consumer>
    {currentValue => (
      <UIContext.Provider value={{ ...currentValue, ...value }}>{children}</UIContext.Provider>
    )}
  </UIContext.Consumer>
)
