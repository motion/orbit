/**
 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * Taken from https://github.com/component/throttle v1.0.0
 *
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 */

export default function throttle(func, wait) {
  let ctx
  let args
  let rtn
  let timeoutID
  let last = 0

  function call() {
    timeoutID = 0
    last = Date.now()
    rtn = func.apply(ctx, args)
    ctx = null
    args = null
  }

  return function throttled(this: any, ...rest) {
    ctx = this
    args = rest
    const delta = Date.now() - last
    if (!timeoutID) {
      if (delta >= wait) call()
      else timeoutID = setTimeout(call, wait - delta)
    }
    return rtn
  }
}
