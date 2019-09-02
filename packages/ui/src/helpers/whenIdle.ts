/**
 * A simple promisified wrapper around requestIdleCallback
 */
export const whenIdle = () => {
  return new Promise(res => {
    window['requestIdleCallback'](res)
  })
}
