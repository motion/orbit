// @ts-ignore
import { dialog } from 'electron'

export async function showConfirmDialog({
  type = 'question',
  title = '',
  message = '',
}): Promise<boolean> {
  const { response } = await dialog.showMessageBox({
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
