import { AppConfig } from '@mcro/stores'
import { isEqual } from 'lodash'

const MIN_Y = 60
const EDGE_PAD = 20
const BOTTOM_PAD = 40
const NUDGE_AMT = 40

const screenSize = () => [window.innerWidth, window.innerHeight]

type WindowMap = {
  position: [number, number]
  size: [number, number]
  peekOnLeft: boolean
}

export type Position = {
  top: number
  left: number
  width: number
  height: number
}

const sizes = [[500, 960]]

// dynamic peek size
// always slightly taller than wide
// capped between a set range
const getPeekSize = ([screenWidth]: number[], appConfig?: AppConfig) => {
  const config = appConfig && appConfig.viewConfig
  let preferred
  if (config && config.dimensions) {
    preferred = config.dimensions
  } else {
    if (config && config.contentSize) {
      const index = Math.min(
        sizes.length - 1,
        Math.max(0, Math.round(config.contentSize / 50 - 0.5)),
      )
      preferred = sizes[index]
    } else {
      preferred = [screenWidth / 3.25, screenWidth / 2.75]
    }
  }
  const max = [930, 920]
  const min = [480, 300] // pretty cute small window
  return preferred
    .map((z, i) => Math.min(z, max[i]))
    .map((z, i) => Math.max(z, min[i]))
    .map(x => Math.round(x))
}

let lastPeek = null
let lastTarget = null

export function peekPosition(
  target,
  appConfig: AppConfig,
  parentBounds: Position,
): WindowMap | null {
  if (!target) {
    return null
  }
  const nextPosition = getPeekPositionFromTarget(target, lastPeek, appConfig, parentBounds)
  lastPeek = nextPosition
  lastTarget = target
  return nextPosition
}

// peek window will prefer to "stay in place"
// so if you are moving down a list it will stay in place until it has to move
// but we don't want to stay alllll the way in place because it looks better to move a little
// so we'll nudge it down just a little.

function getLazyPosition(target: Position, peekHeight: number, lastPeek: WindowMap): number {
  if (!lastPeek || !lastTarget) {
    return target.top
  }
  let y = target.top
  const peekLastY = lastPeek.position[1]
  // adjacent (in grid next to each other)
  if (target.top === lastTarget.top) {
    return peekLastY
  }
  if (target.top > lastTarget.top) {
    // moving DOWN
    if (target.top > peekLastY + peekHeight) {
      // target is BELOW peek, do minimum possible (+ edge pad)
      y = target.top - peekHeight + BOTTOM_PAD
    } else {
      // target is WITHIN peek, do a small nudge
      y = peekLastY + NUDGE_AMT
    }
    // ensure we don't nudge too far down
    // right now this is done in getPeekPositionFromTarget... TODO put here
    // y = Math.max()
  } else {
    // moving UP
    if (target.top < peekLastY) {
      // target is ABOVE peek
      y = target.top
    } else {
      // target is WITHIN peek, small nudge
      y = peekLastY - NUDGE_AMT
    }
  }
  // ensure we don't nudge too far up
  y = Math.max(MIN_Y, y)
  // and not too far down
  y = Math.min(y, target.top - 10)
  return y
}

function getPeekPositionFromTarget(
  target,
  lastPeek,
  appConfig: AppConfig,
  parentBounds: Position,
  appOnLeft?: boolean,
): WindowMap | null {
  // dont reset position on same target re-opening
  if (isEqual(target, lastTarget)) {
    return lastPeek
  }
  const [screenW, screenH] = screenSize()
  const leftSpace = target.left
  const rightSpace = screenW - (target.left + parentBounds.width)
  let peekOnLeft = leftSpace > rightSpace
  let [pW, pH] = getPeekSize(screenSize(), appConfig)
  let x
  let y = getLazyPosition(target, pH, lastPeek)

  // prefer away from app if possible
  if (typeof appOnLeft === 'boolean') {
    if (peekOnLeft && appOnLeft && rightSpace > pW + EDGE_PAD) {
      peekOnLeft = false
    }
    if (!peekOnLeft && !appOnLeft && leftSpace > pW + EDGE_PAD) {
      peekOnLeft = true
    }
  }

  if (peekOnLeft) {
    x = target.left - pW
    if (pW > leftSpace) {
      pW = leftSpace
      x = 0
    }
  } else {
    x = target.left + parentBounds.width
    if (pW > rightSpace) {
      pW = rightSpace
    }
  }
  // too tall
  if (pH + y + EDGE_PAD > screenH) {
    y = screenH - pH - EDGE_PAD
  }

  return {
    position: [Math.round(x), Math.round(y)],
    size: [pW, pH],
    peekOnLeft,
  }
}
