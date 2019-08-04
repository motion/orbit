type StdOutListener = (out: string) => any

let listeners = new Set<StdOutListener>()

export function interceptStdOut(callback: StdOutListener) {
  listeners.add(callback)
}

function interceptProcessOut(callback: StdOutListener) {
  var old_write = process.stdout.write
  // @ts-ignore
  process.stdout.write = (function(write) {
    return function(string) {
      // @ts-ignore
      write.apply(process.stdout, arguments)
      callback(string)
    }
  })(process.stdout.write)
  return function() {
    process.stdout.write = old_write
  }
}

interceptProcessOut(message => {
  if (listeners.size) {
    listeners.forEach(x => x(message))
  }
})
