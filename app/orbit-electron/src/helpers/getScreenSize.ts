import { screen } from 'electron'

export function getScreenSize() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  return [width, height]
}
