// @ts-ignore
import Electron from 'electron'

export function getScreenSize() {
  const { width, height } = Electron.screen.getPrimaryDisplay().workAreaSize
  return [width, height]
}
