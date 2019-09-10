const ReactRefreshHotModule = require.resolve('./ReactRefreshHotModule')

const ReactRefreshHotModuleInjection = `
const ReactRefreshHotModule = require('${ReactRefreshHotModule}');
const modules = { ...__webpack_exports__ }
for (const key in modules) {
  if (modules[key] && modules[key]._ignoreHMRCheck) {
    delete modules[key]
  }
}
if (ReactRefreshHotModule.isReactRefreshBoundary(modules)) {
  module.hot.accept(() => {
    ReactRefreshHotModule.enqueueUpdate();
  });
}
`

export default function HotModuleLoader(source) {
  return source + ReactRefreshHotModuleInjection
}
