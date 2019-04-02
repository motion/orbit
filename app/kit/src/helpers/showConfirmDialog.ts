import { IS_ELECTRON } from '../constants'
import * as Electron from './showConfirmDialog.electron'

export function showConfirmDialog(args): boolean {
  if (IS_ELECTRON) {
    return Electron.showConfirmDialog(args)
  } else {
    return confirm(args.title)
  }
}
