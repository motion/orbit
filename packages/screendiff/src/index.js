// @flow
import Native from '../native'

type ScreenOptions = {
  // output screenshot file path
  destination: string,
  // width, height
  bounds: [number, number],
  // left, top
  offset: [number, number],
}

export function screen(options: ScreenOptions) {
  const {
    destination = '/tmp/screen.png',
    bounds = [0, 0],
    offset = [0, 0],
  } = options
  return Native.screen(destination, ...bounds, ...offset)
}
