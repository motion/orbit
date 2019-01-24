export function preventDefault(cb: Function) {
  return (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cb(e)
  }
}
