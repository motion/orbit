export const nextTick = (fn: Function) => setTimeout(fn, 0)

export const platform = 'browser'
export const arch = 'browser'
export const execPath = 'browser'
export const title = 'browser'
export const pid = 1
export const browser = true
export const argv = []

export const binding = function binding() {
  throw new Error('No such module. (Possibly not yet loaded)')
}

export const cwd = () => '/'

const idFn = () => {}

export const exit = idFn
export const kill = idFn
export const chdir = idFn
export const umask = idFn
export const dlopen = idFn
export const uptime = idFn
export const memoryUsage = idFn
export const uvCounters = idFn
export const features = {}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
}
