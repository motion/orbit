import { getConfig } from '@mcro/config'

export const checkAuthProxy = async () => {
  try {
    const testUrl = `${getConfig().privateUrl}/hello`
    console.log(`Checking testurl: ${testUrl}`)
    setTimeout(() => {
      throw new Error('timeout')
    }, 500)
    const res = await fetch(testUrl).then(res => res.text())
    if (res && res === 'hello world') {
      return true
    }
  } catch (err) {
    console.log('error seeing if already proxied')
  }
  return false
}
