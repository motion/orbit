export { RootView } from './RootView'

import './createElement'

if (module.hot && module.hot.addStatusHandler) {
  if (module.hot.status() === 'idle') {
    module.hot.addStatusHandler(status => {
      if (status === 'apply') {
        setTimeout(() => {
          console.log('[HMR] Re-render')
          // @ts-ignore
          window.render()
        })
      }
    })
  }
}
