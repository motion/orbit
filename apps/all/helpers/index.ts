// export * from './proxySetters'

import * as Proxies from './proxySetters'
export const proxySetters = Proxies.proxySetters
// console.log('Proxies', Proxies)

export const wordKey = word => word.join('-')
export const setGlobal = (name: string, val: any) => {
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
