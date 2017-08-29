import { screen } from 'electron'

const MIN_WIDTH = 750
const MIN_HEIGHT = 600
const MAX_WIDTH = 950
const MAX_HEIGHT = 800

export const measure = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const size = [
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width / 1.8))),
    Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(height / 1.5))),
  ]
  const middleX = Math.round(width / 2 - size[0] / 2)
  const middleY = Math.round(height / 2 - size[1] / 2)
  // const endX = width - size[0] - 20
  // const endY = height - size[1] - 20

  return {
    size,
    position: [middleX, middleY],
  }
}
