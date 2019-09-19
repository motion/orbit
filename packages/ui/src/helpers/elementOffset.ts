export function elementOffset(elem) {
  let top = 0
  let left = 0
  do {
    if (!isNaN(elem.offsetTop)) {
      top += elem.offsetTop
    }
    if (!isNaN(elem.offsetLeft)) {
      left += elem.offsetLeft
    }
  } while ((elem = elem.offsetParent))
  return { top, left }
}
