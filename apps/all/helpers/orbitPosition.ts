import screenSize from './screenSize'
import debug from '@mcro/debug'

const log = debug('orbitPosition')
const INITIAL_SIZE = [330, 420]
const VERT_PAD = 5 // small vertical pad allows you to resize attached window

export default function orbitPosition({ left, top, width, height }) {
  let orbitH = height
  let [orbitW] = INITIAL_SIZE
  const [screenW, screenH] = screenSize()
  const leftSpace = left
  const rightSpace = screenW - (left + width)
  if (rightSpace < orbitW && leftSpace < orbitW) {
    return {
      position: [screenW - orbitW, 0],
      size: [orbitW, orbitH],
      orbitOnLeft: true,
      orbitDocked: true,
    }
  }
  const orbitOnLeft = leftSpace > rightSpace
  let x
  let y = top
  if (orbitOnLeft) {
    x = left - orbitW
    if (orbitW > leftSpace) {
      orbitW = leftSpace
      x = 0
    }
  } else {
    x = left + width
    if (orbitW > rightSpace) {
      orbitW = rightSpace
    }
  }
  y += VERT_PAD
  orbitH -= VERT_PAD
  if (orbitH + y > screenH) {
    // height = screenH - SCREEN_PAD - y
    log(`too big, adjusting height ${orbitH} screenH ${screenH}`)
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [orbitW, orbitH],
    orbitOnLeft,
    orbitDocked: false,
  }
}
