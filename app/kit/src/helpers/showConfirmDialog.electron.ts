export function showConfirmDialog({ type = 'question', title = '', message = '' }): boolean {
  const electron = require('electron').remote ? require('electron').remote : require('electron')
  const response = electron.dialog.showMessageBox({
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
