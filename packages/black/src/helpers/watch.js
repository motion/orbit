// @flow
// use this in @stores to autorun autoruns
export default function watch(fn: Function) {
  function temp() {
    return fn(this.props, this.context)
  }
  temp.autorunme = true
  return temp
}
