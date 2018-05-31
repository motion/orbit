import _keyCode from 'keycode'

// fix react synth event
export function keyCode(event) {
  event.persist()
  const code = _keyCode(event)
  if (localStorage.debug) {
    console.log(code)
  }
  return code
}
