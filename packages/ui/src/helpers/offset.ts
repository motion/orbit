export function offset(ev, target, rect) {
  target = target || ev.currentTarget || ev.srcElement
  const cx = ev.clientX || 0
  const cy = ev.clientY || 0
  const box = rect || target.getBoundingClientRect()
  return [cx - box.left, cy - box.top]
}
