import { dialog } from 'electron'

export function showConfirmDialog({ type = 'question', title = '', message = '' }): boolean {
  const response = dialog.showMessageBox({
    type,
    title,
    message,
    buttons: ['Ok', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  })
  if (response === 0) {
    return true
  }
  return false
}
