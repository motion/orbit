import screenSize from './screenSize'

const log = debug('orbitPosition')
const INITIAL_SIZE = [330, 420]
const SCREEN_PAD = 15
const VERT_PAD = 5 // small vertical pad allows you to resize attached window

export default function orbitPosition({ left, top, width, height }) {
  let orbitH = height
  let [orbitW] = INITIAL_SIZE
  const [screenW, screenH] = screenSize()
  const leftSpace = left
  const rightSpace = screenW - (left + width)
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
  if (height + y + SCREEN_PAD > screenH) {
    // height = screenH - SCREEN_PAD - y
    log(`too big, adjusting height ${height} screenH ${screenH}`)
  }
  y += VERT_PAD
  orbitH -= VERT_PAD
  return {
    position: [Math.round(x), Math.round(y)],
    size: [orbitW, orbitH],
    orbitOnLeft,
  }
}
