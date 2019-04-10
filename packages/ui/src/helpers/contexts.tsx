import * as React from 'react'

export type UIContextType = {
  hovered?: boolean | undefined
}

export const UIContext = React.createContext<UIContextType>({
  hovered: undefined,
})

export function MergeUIContext({ value, children }) {
  const currentValue = React.useContext(UIContext)
  return <UIContext.Provider value={{ ...currentValue, ...value }}>{children}</UIContext.Provider>
}
