export function preventDefault(cb: Function) {
  return (e: React.MouseEvent<any>) => {
    e.preventDefault()
    e.stopPropagation()
    cb(e)
  }
}
