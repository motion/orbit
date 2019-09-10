const ReactRefreshHotModule = require.resolve('./ReactRefreshHotModule')

const ReactRefreshHotModuleInjection = `
const ReactRefreshHotModule = require('${ReactRefreshHotModule}');
if (ReactRefreshHotModule.isReactRefreshBoundary(module.exports || module.__proto__exports || { ...__webpack_exports__ })) {
  module.hot.accept(() => {
    ReactRefreshHotModule.enqueueUpdate();
  });
}
`

export default function HotModuleLoader(source) {
  return source + ReactRefreshHotModuleInjection
}
