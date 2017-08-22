import _keyCode from 'keycode'

// fix react synth event
export default function keyCode(event: Event) {
  event.persist()
  const code = _keyCode(event)
  if (localStorage.debug) {
    console.log(code)
  }
  return code
}
