import { getGlobalConfig } from '@mcro/config'

export const checkAuthProxy = () => {
  return new Promise(res => {
    const testUrl = `${getGlobalConfig().urls.authProxy}/hello`
    // timeout
    const tm = setTimeout(() => res(false), 500)
    fetch(testUrl)
      .then(res => res.text())
      .then(text => {
        if (text === 'hello world') {
          clearTimeout(tm)
          res(true)
        }
      })
      .catch(() => {
        console.log('proxy not active')
        res(false)
      })
  })
}
