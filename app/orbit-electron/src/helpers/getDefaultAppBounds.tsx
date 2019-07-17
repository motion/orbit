export function getDefaultAppBounds(screenSize: number[]) {
  // max initial size to prevent massive screen on huge monitor
  let scl = 0.8
  let w = screenSize[0] * scl
  let h = screenSize[1] * scl
  // clamp width to not be too wide
  w = Math.min(h * 1.4, w)
  const maxSize = [1280, 900]
  const minSize = [780, 640]
  const size = [w, h]
    .map(x => Math.round(x))
    .map((x, i) => Math.min(maxSize[i], x))
    .map((x, i) => Math.max(minSize[i], x))
  // centered
  const TOOLBAR_HEIGHT = 23
  const position = [
    // width
    screenSize[0] / 2 - w / 2,
    // height
    screenSize[1] / 2 - h / 2 + TOOLBAR_HEIGHT,
  ].map(x => Math.round(x))
  return { size, position }
}
