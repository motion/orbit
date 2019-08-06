export function getWindowId() {
  if (process.env.WINDOW_ID) {
    return +process.env.WINDOW_ID
  }
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const match = window.location.search.match(/id=([0-9])+/)
    if (match) {
      return +match[1]
    }
  }
  return 0
}
