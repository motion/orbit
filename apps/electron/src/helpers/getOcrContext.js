import 'isomorphic-fetch'
import { URL } from 'url'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default async ({ offset, bounds }) => {
  if (!offset || !bounds) {
    throw new Error(`No bounds or offset given`)
  }
  const url = new URL('http://orbit.dev/ocr')
  url.searchParams.append('offset', offset)
  url.searchParams.append('bounds', bounds)
  const start = +new Date()
  const { boxes } = await (await fetch(url.href)).json()
  console.log('ocr took', +new Date() - start)
  console.log('boxes are', boxes.slice(0, 2))

  // box is left top right bottom

  const highlights = boxes.map(({ name, weight, box }) => {
    const left = offset[0] + box[0]
    const topOffset = 24
    const top = offset[1] + box[1] - topOffset
    const width = offset[0] + box[2] - left
    const height = offset[1] + box[3] - top - topOffset
    return {
      word: name,
      weight,
      top,
      left,
      width,
      height,
    }
  })

  await sleep(200)
  return highlights
}
