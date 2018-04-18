// export * from './proxySetters'

import * as Proxies from './proxySetters'
export const proxySetters = Proxies.proxySetters
// console.log('Proxies', Proxies)

export const wordKey = word => word.join('-')
export const setGlobal = (name: string, val: any) => {
  // @ts-ignore this is chill its used in eval
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
