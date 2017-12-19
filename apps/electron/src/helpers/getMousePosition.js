import { screen } from 'electron'

export default function getMousePosition() {
  return screen.getCursorScreenPoint()
}
