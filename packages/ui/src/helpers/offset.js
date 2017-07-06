export default function offset(ev, target, out) {
  target = target || ev.currentTarget || ev.srcElement
  if (!Array.isArray(out)) {
    out = [0, 0]
  }
  const cx = ev.clientX || 0
  const cy = ev.clientY || 0
  const rect = target.getBoundingClientRect()
  out[0] = cx - rect.left
  out[1] = cy - rect.top
  return out
}
