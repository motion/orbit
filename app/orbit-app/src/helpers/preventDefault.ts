export function preventDefault(e: React.MouseEvent<any>) {
  e.preventDefault()
  e.stopPropagation()
  return e
}
