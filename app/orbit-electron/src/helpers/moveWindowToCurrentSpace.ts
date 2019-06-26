import { Logger } from '@o/logger'
import { BrowserWindow } from 'electron'

const log = new Logger('electron')

export function moveWindowToCurrentSpace(ref: BrowserWindow) {
  log.info('Show on new space...')
  ref.setVisibleOnAllWorkspaces(true) // put the window on all screens
  ref.focus() // focus the window up front on the active screen
  ref.setVisibleOnAllWorkspaces(false) // disable all screen behavior
}
