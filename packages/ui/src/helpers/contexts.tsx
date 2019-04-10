import * as React from 'react'

export type UIContextType = {
  hovered?: boolean
}

export const UIContext = React.createContext<UIContextType>({
  hovered: false,
})

export function MergeUIContext({ value, children }) {
  const currentValue = React.useContext(UIContext)
  return <UIContext.Provider value={{ ...currentValue, ...value }}>{children}</UIContext.Provider>
}
