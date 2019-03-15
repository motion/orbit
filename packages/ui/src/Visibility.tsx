import React, { createContext, useContext } from 'react'

const VisibilityContext = createContext<boolean | null>(null)

export function Visibility(props: { visible: boolean; children: any }) {
  return (
    <VisibilityContext.Provider value={props.visible}>{props.children}</VisibilityContext.Provider>
  )
}

export function useVisiblity() {
  return useContext(VisibilityContext)
}
