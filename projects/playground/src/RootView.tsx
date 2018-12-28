import * as React from 'react'
import { TestHMR } from './TestHMR'
import { TestUI } from './TestUI'

export const RootView = () => {
  return (
    <>
      <TestUI />
      <TestHMR />
    </>
  )
}
