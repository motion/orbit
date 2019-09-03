import { App } from '@o/reactron'
import * as React from 'react'

import { devTools } from './helpers/devTools'

if (process.env.NODE_ENV === 'development') {
  require('./dev')
}

export default function ElectronRoot(props: { children: any }) {
  return (
    <App
      onWillQuit={() => {
        require('global').handleExit()
      }}
      devTools={devTools}
    >
      {props.children}
    </App>
  )
}
