import { getGlobalConfig } from "@mcro/config";

export default async function getCrawler() {
  try {
    const res = await fetch(`${getGlobalConfig().urls.server}/crawler/app.js`)
    return await res.text()
  } catch (e) {
    console.log('error getting crawler', e)
    return ''
  }
}
