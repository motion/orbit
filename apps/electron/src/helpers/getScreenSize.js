import { screen } from 'electron'

const TOPBAR_HEIGHT = 30

export default function getScreenSize() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  console.log('screen size', [width, height])
  return [width, height]
}
