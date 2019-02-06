import * as React from 'react'

type UISegment = {
  first?: boolean
  last?: boolean
  index?: number
}

export type UIContextType = {
  hovered?: boolean
  inSegment: UISegment | null
  inForm: {
    formValues: { [key: string]: string | number | Function }
    submit: Function
  } | null
}

export const UIContext = React.createContext({
  inSegment: null,
  hovered: false,
  inForm: null,
} as UIContextType)

export function MergeUIContext({ value, children }) {
  const currentValue = React.useContext(UIContext)
  return <UIContext.Provider value={{ ...currentValue, ...value }}>{children}</UIContext.Provider>
}
