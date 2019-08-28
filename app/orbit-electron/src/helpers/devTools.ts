export let devTools = null

if (process.env.NODE_ENV === 'development') {
  const tools = require('@o/reactron/devtools')
  devTools = [tools.mobx, tools.react]
}
