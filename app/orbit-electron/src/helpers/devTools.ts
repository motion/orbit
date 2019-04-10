export let devTools = null

if (process.env.NODE_ENV === 'development') {
  const tools = require('@o/reactron/devtools')

  // const devToolsReactNew = join(require.resolve('@o/react-devtools'), '..')

  devTools = [tools.mobx, tools.react /* , devToolsReactNew */]
}
