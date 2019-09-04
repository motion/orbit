export let devTools = null

if (process.env.NODE_ENV === 'development') {
  const defaultDevTools = require('@o/reactron/devtools')
  devTools = [defaultDevTools.mobx, defaultDevTools.react]
}
