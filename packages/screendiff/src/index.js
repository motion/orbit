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

const getArguments = ({
  destination = '/tmp/screen.png',
  bounds = [0, 0],
  offset = [0, 0],
  scale = 1,
  contrast = 0,
}) => [destination, ...bounds, ...offset, scale, contrast]

export function screen(options: ScreenOptions) {
  return Native.screen(...getArguments(options))
}
