import * as React from 'react'
import { AppDefinition } from './types/AppDefinition'

type Context = {
  // AppDefinition ID
  identifier: string
  // Pane ID
  // XXX(andreypopp): is this correct?
  id: string

  appDef: null | AppDefinition
}

export default React.createContext<Context>({
  identifier: '',
  id: '',
  appDef: null
})
