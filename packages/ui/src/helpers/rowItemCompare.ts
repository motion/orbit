// for some reason with dynamiclist, react-window sends new objects with same values
// so we just stringify compare the style
// this really helps with the first frame of scrolling performance

export const rowItemCompare = (a, b) => {
  for (const key in b) {
    if (key === 'style') {
      if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
        return false
      }
    }
    if (b[key] !== a[key]) {
      return false
    }
  }
  return true
}
