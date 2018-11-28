import { getGlobalConfig } from '@mcro/config'

export async function checkAuthProxy() {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 4000)

  try {
    const res = await fetch(`${getGlobalConfig().urls.auth}/hello`, { signal: controller.signal })
    if (res.status === 200) {
      return true
    }
    console.log('nope', res.status)
    return false
  } catch (err) {
    console.log('checkAuthProxy err', err.message)
  } finally {
    clearTimeout(timeout)
    return false
  }
}
