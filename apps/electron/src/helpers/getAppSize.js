import { screen } from 'electron'

export const sleep = ms => new Promise(res => setTimeout(res, ms))

const MIN_WIDTH = 800
const MIN_HEIGHT = 500
const MAX_HEIGHT = 1000
const MAX_WIDTH = 1450
const MAX_WIDTH_TO_HEIGHT = 1.15
const TOPBAR_HEIGHT = 30

export default function getAppSize() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const boundedHeight = Math.min(MAX_HEIGHT, height - 100)
  const maxWidthByPercentOfHeight = boundedHeight * MAX_WIDTH_TO_HEIGHT // at most x width of height
  const boundedWidth = Math.min(maxWidthByPercentOfHeight, MAX_WIDTH)

  const size = [
    Math.min(boundedWidth, Math.max(MIN_WIDTH, Math.round(width / 1.75))),
    Math.min(boundedHeight, Math.max(MIN_HEIGHT, Math.round(height / 1.2))),
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
