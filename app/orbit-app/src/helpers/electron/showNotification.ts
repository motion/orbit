// @ts-ignore
const Electron = electronRequire('electron')

export function showNotification({ title = '', message = '' }) {
  return new Notification(title, { body: message })
}
