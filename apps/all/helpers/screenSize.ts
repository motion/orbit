// @ts-ignore provided by some apps
import { screen } from 'electron'

export default function screenSize() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  return [width, height]
}
