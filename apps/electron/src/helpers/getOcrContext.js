import 'isomorphic-fetch'
import { URL } from 'url'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default async ({ position, size }) => {
  const url = new URL('http://orbit.dev/ocr')
  url.searchParams.append('position', position)
  url.searchParams.append('size', size)
  const start = +new Date()
  const { boxes } = await (await fetch(url.href)).json()
  console.log('ocr took', +new Date() - start)
  console.log('boxes are', boxes.slice(0, 2))

  // box is left top right bottom

  const highlights = boxes.map(({ name, weight, box }) => {
    const left = position[0] + box[0]
    const offset = 24
    const top = position[1] + box[1] - offset
    const width = position[0] + box[2] - left
    const height = position[1] + box[3] - top - offset
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
