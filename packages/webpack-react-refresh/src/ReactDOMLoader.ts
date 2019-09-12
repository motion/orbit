const ReactRefreshRuntimeInjection = `
if (typeof window !== 'undefined') {
  const ReactRefreshRuntime = require('react-refresh/runtime');
  ReactRefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => type => type;
  window.__setupReactRefreshForModule = (moduleId) => {
    const prevRefreshReg = window.$RefreshReg$;
    const prevRefreshSig = window.$RefreshSig$;
    window.$RefreshReg$ = (type, id) => {
      const fullId = moduleId + ' ' + id;
      ReactRefreshRuntime.register(type, fullId);
    };
    window.$RefreshSig$ = ReactRefreshRuntime.createSignatureFunctionForTransform;
    return () => {
      window.$RefreshReg$ = prevRefreshReg;
      window.$RefreshSig$ = prevRefreshSig;
    };
  };
}
`

export default function ReactDOMLoader(source) {
  return ReactRefreshRuntimeInjection + source
}
