import { AppDefinition } from '@o/models'
import * as React from 'react'

type AppLoadInfo = {
  // AppDefinition ID
  identifier: string
  // AppBit ID
  id: number
  // Full AppDefinition
  appDef: null | AppDefinition
}

export const AppLoadContext = React.createContext<AppLoadInfo>({
  identifier: '',
  id: -1,
  appDef: null,
})
