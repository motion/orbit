// @flow
import Native from '../native'
import { exec } from 'node-exec-promise'

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

export async function screen(options: ScreenOptions) {
  const args = getArguments(options)
  console.log('args', args)
  console.time('rust')
  const res = Native.screen(...args)
  console.timeEnd('rust')
  return res
}
