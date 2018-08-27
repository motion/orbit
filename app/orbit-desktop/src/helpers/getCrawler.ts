import { getConfig } from '../config'

export default async function getCrawler() {
  try {
    const res = await fetch(`${getConfig().server.url}/crawler/app.js`)
    return await res.text()
  } catch (e) {
    console.log('error getting crawler', e)
    return ''
  }
}
