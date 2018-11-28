import { getGlobalConfig } from '@mcro/config'

export async function checkAuthProxy() {
  try {
    if (await fetch(`${getGlobalConfig().urls.auth}/hello`)) {
      return true
    }
  } catch (err) {
    return false
  }
}
