import { getGlobalConfig } from '@o/config'

export async function checkAuthProxy() {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 4000)

  try {
    // temporarily dont care about our weird generated ssl
    const last = process.env['NODE_TLS_REJECT_UNAUTHORIZED']
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const proxyTestUrl = `${getGlobalConfig().urls.auth}/hello`
    const res = await fetch(proxyTestUrl, {
      signal: controller.signal,
    })
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = last
    if (res.status === 200) {
      return true
    }
    console.log('nope', res.status)
    return false
  } catch (err) {
    if (err.message.indexOf('ECONNREFUSED') === -1) {
      console.log('checkAuthProxy err', err.message)
    } else {
      // no connection yet, fine failure case
    }
  } finally {
    clearTimeout(timeout)
  }
  return false
}
