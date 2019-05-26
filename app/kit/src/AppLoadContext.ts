import { AppDefinition } from '@o/models'
import * as React from 'react'

type AppLoadInfo = {
  // AppDefinition ID
  identifier: string
  // App Instance ID (can have more than one of same identifier)
  id: string
  // Full AppDefinition
  appDef: null | AppDefinition
}

export const AppLoadContext = React.createContext<AppLoadInfo>({
  identifier: '',
  id: '',
  appDef: null,
})
