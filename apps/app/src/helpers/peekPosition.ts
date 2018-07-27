import * as Constants from '@mcro/constants'
import { App } from '@mcro/stores'

const SHADOW_PAD = 15
const EDGE_PAD = 20
const screenSize = () => [window.innerWidth, window.innerHeight]

type WindowMap = {
  position: [number, number]
  size: [number, number]
  peekOnLeft: boolean
}

type Position = {
  top: number
  left: number
  width: number
  height: number
}

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

let lastPeek = null
let lastTarget = null

export function peekPosition(target): WindowMap | null {
  const nextPosition = getPeekPositionFromTarget(target, lastPeek)
  lastPeek = nextPosition
  lastTarget = target
  return nextPosition
}

// peek window will prefer to "stay in place"
// so if you are moving down a list it will stay in place until it has to move
// but we don't want to stay alllll the way in place because it looks better to move a little
// so we'll nudge it down just a little.

const BOTTOM_PAD = 40
const NUDGE_AMT = 40

function getLazyPosition(
  target: Position,
  peekHeight: number,
  lastPeek: WindowMap,
): number {
  if (!lastPeek || !lastTarget) {
    return target.top
  }
  let y = target.top
  const peekLastY = lastPeek.position[1]
  // moving DOWN
  if (target.top > lastTarget.top) {
    // target is BELOW peek, do minimum possible (+ edge pad)
    if (target.top > peekLastY + peekHeight) {
      y = target.top - peekHeight + BOTTOM_PAD
    } else {
      // target is WITHIN peek, do a small nudge
      y = peekLastY + NUDGE_AMT
    }
    // ensure we don't nudge too far down
    // right now this is done in getPeekPositionFromTarget... TODO put here
    // y = Math.max()
  }
  // moving UP
  else {
    // target is ABOVE peek
    if (target.top < peekLastY) {
      y = target.top
    } else {
      // target is WITHIN peek, small nudge
      y = peekLastY - NUDGE_AMT
    }
    // ensure we don't nudge too far up
    y = Math.max(target.top, y)
  }
  return y
}

function getPeekPositionFromTarget(target, lastPeek): WindowMap | null {
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
  const leftSpace = target.left
  const rightSpace = screenW - (target.left + orbitWidth)
  // prefer bigger area
  let peekOnLeft = leftSpace > rightSpace
  let [pW, pH] = getPeekSize(screenSize())
  let x
  let y = getLazyPosition(target, pH, lastPeek)
  // prefer more strongly away from app if possible
  if (peekOnLeft && !orbitOnLeft && rightSpace > pW + EDGE_PAD) {
    peekOnLeft = false
  }
  if (!peekOnLeft && orbitOnLeft && leftSpace > pW + EDGE_PAD) {
    peekOnLeft = true
  }
  if (peekOnLeft) {
    x = target.left - pW
    if (orbitOnLeft) {
      x -= SHADOW_PAD
    }
    if (pW > leftSpace) {
      pW = leftSpace
      x = 0
    }
  } else {
    x = target.left + orbitWidth
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
