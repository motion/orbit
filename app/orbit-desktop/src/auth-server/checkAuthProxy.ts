import { getGlobalConfig } from '@mcro/config'

export async function checkAuthProxy() {
  try {
    if (await fetch(`${getGlobalConfig().urls.auth}/hello`)) {
      return true
    }
  } catch (err) {
    console.debug('error fetching proxy url', err)
    return false
  }
}
