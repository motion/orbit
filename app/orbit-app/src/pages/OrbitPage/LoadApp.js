// XXX(andreypopp): This file is in JS because of webpackIgnore comment below
// which is being mangled by the TS compiler. It'd be nice to find a way to do
// that in TS though. For now let's keep this small and simple as possible.
import * as React from 'react'

export let LoadApp = ({ bundleURL, RenderApp }) => {
  let Lazy = React.useMemo(
    () =>
      React.lazy(async () => {
        await import(/* webpackIgnore: true */ bundleURL)
        // TODO(andreypopp): this is hacky, find a way to expose app via bundle
        // eval result
        let appDef = window['OrbitAppToRun']
        return { default: () => React.createElement(RenderApp, { appDef }) }
      }),
    [bundleURL, RenderApp],
  )
  return React.createElement(Lazy, null)
}
