import * as Constants from '~/constants'

export default async function getCrawler() {
  try {
    const res = await fetch(`${Constants.APP_URL}/crawler/app.js`)
    return await res.text()
  } catch (e) {
    console.log('error getting crawler', e)
    return ''
  }
}
