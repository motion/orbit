import * as Constants from '@mcro/constants'
import { App } from '@mcro/stores'

const SHADOW_PAD = 15
const EDGE_PAD = 20
const TOP_OFFSET = 0
const screenSize = () => [window.innerWidth, window.innerHeight]

// dynamic peek size
// always slightly taller than wide
// capped between a set range
const getPeekSize = ([screenWidth]: number[]) => {
  const max = [800, 900]
  const min = [600, 700]
  const preferred = [screenWidth / 3, screenWidth / 2.45]
  return preferred
    .map((z, i) => Math.min(z, max[i]))
    .map((z, i) => Math.max(z, min[i]))
}

export default function peekPosition(target) {
  if (!target) {
    return null
  }
  const [screenW, screenH] = screenSize()
  let { orbitOnLeft } = App
  let orbitWidth = App.orbitState.size[0]
  if (App.orbitState.docked) {
    orbitOnLeft = false
    orbitWidth = Constants.ORBIT_WIDTH
  }
  const { left, top } = target
  const leftSpace = left
  const rightSpace = screenW - (left + orbitWidth)
  // prefer bigger area
  let peekOnLeft = leftSpace > rightSpace
  let [pW, pH] = getPeekSize(screenSize())
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
    x = left + orbitWidth
    if (pW > rightSpace) {
      pW = rightSpace
    }
  }
  // too tall
  if (pH + y + EDGE_PAD > screenH) {
    y = screenH - pH - EDGE_PAD
  }
  // adjust for when the peek is facing the arrow side of orbit
  if (orbitOnLeft && !peekOnLeft) {
    x -= Constants.ARROW_PAD
  }
  if (!orbitOnLeft && peekOnLeft) {
    x += Constants.ARROW_PAD
  }
  // adjust for docked
  if (App.orbitState.docked) {
    x -= 24
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [pW, pH],
    peekOnLeft,
  }
}
