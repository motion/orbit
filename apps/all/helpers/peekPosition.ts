import screenSize from './screenSize'
import * as Constants from '@mcro/constants'

const SHADOW_PAD = 15
const EDGE_PAD = 20
const TOP_OFFSET = -20

export default function peekPosition(target, App) {
  const [screenW, screenH] = screenSize()
  const { orbitOnLeft } = App
  const [width] = App.orbitState.size
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
    if (orbitOnLeft) {
      x -= SHADOW_PAD
    }
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
  // too tall
  if (pH + y + EDGE_PAD > screenH) {
    console.log('y, pH, screenH', y, pH, screenH)
    y = screenH - pH - EDGE_PAD
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
