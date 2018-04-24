import screenSize from './screenSize'
import * as Constants from '@mcro/constants'

// const PAD = 15
const EDGE_PAD = 20
const TOP_OFFSET = -20

export default function peekPosition(target, Electron) {
  const [screenW, screenH] = screenSize()
  const { orbitOnLeft } = Electron
  const [width] = Electron.orbitState.size
  const { left, top } = target
  const leftSpace = left
  const rightSpace = screenW - (left + width)
  // prefer bigger area
  let peekOnLeft = leftSpace > rightSpace
  let [pW, pH] = Constants.PEEK_SIZE
  let x
  let y = top + TOP_OFFSET
  // prefer more strongly away from app if possible
  if (peekOnLeft && !orbitOnLeft && rightSpace > pW + EDGE_PAD) {
    peekOnLeft = false
  }
  if (!peekOnLeft && orbitOnLeft && leftSpace > pW + EDGE_PAD) {
    peekOnLeft = true
  }
  if (peekOnLeft) {
    x = left - pW
    if (pW > leftSpace) {
      pW = leftSpace
      x = 0
    }
  } else {
    x = left + width
    if (pW > rightSpace) {
      pW = rightSpace
    }
  }
  if (pH + y + EDGE_PAD > screenH) {
    y = EDGE_PAD
    pH = screenH - EDGE_PAD * 2
  }
  // adjust for when the peek is facing the arrow side of orbit
  if (orbitOnLeft && !peekOnLeft) {
    x -= Constants.ARROW_PAD
  }
  if (!orbitOnLeft && peekOnLeft) {
    x += Constants.ARROW_PAD
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [pW, pH],
    peekOnLeft,
  }
}
