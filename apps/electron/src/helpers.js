import { screen } from 'electron'

const MIN_WIDTH = 800
const MIN_HEIGHT = 750
const MAX_WIDTH = 1250 // should be pct or constraint(pct, px)
const MAX_HEIGHT = 800
const TOPBAR_HEIGHT = 30

export const measure = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const size = [
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width / 1.8))),
    Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(height / 1.3))),
  ]
  const middleX = Math.round(width / 2 - size[0] / 2)
  const middleY = Math.round(height / 2 - size[1] / 2) + TOPBAR_HEIGHT
  // const endX = width - size[0] - 20
  // const endY = height - size[1] - 20

  return {
    size,
    position: [middleX, middleY],
  }
}
