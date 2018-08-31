import './installGlobals'
// import * as Mobx from 'mobx'

// just for now since its spitting out so many
import { setConfig } from 'react-hot-loader'

setConfig({
  logLevel: 'no-errors-please',
})

Error.stackTraceLimit = Infinity

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })
