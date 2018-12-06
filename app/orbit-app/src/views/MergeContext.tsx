import * as React from 'react'
import { useContext } from 'react'

export const MergeContext = ({
  Context,
  value,
  children,
}: {
  Context: React.Context<any>
  value: Object
  children: React.ReactNode
}) => {
  const current = useContext(Context)
  return <Context.Provider value={{ ...current, ...value }}>{children}</Context.Provider>
}
