import { ORBIT_WIDTH } from '@mcro/constants'

// small vertical pad allows you to resize attached window
const VERT_PAD = 5
const screenSize = () => [window.innerWidth, window.innerHeight]

export default function orbitPosition({ left, top, width, height }) {
  let orbitW = ORBIT_WIDTH
  const [screenW, screenH] = screenSize()
  let orbitH = height
  const leftSpace = left
  const rightSpace = screenW - (left + width)
  const smallOrbit = orbitH < 700
  if ((rightSpace < orbitW && leftSpace < orbitW) || smallOrbit) {
    orbitH = screenH
    return {
      position: [screenW - orbitW, 0],
      size: [orbitW, orbitH],
      orbitOnLeft: true,
      orbitDocked: true,
    }
  }
  const orbitOnLeft = leftSpace > rightSpace
  let x
  let y = top - 23
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
    height -= screenH - (orbitH + y)
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [orbitW, orbitH],
    orbitOnLeft,
    orbitDocked: false,
  }
}
