export function showNotification({ title = '', message = '' }) {
  return new Notification(title, { body: message })
}
