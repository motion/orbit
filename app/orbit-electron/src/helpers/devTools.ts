export let devTools = null
if (process.env.NODE_ENV === 'development') {
  const tools = require('@mcro/reactron/devtools')
  devTools = [tools.mobx, tools.react]
}
