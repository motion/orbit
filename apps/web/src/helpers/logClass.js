// @flow

function collectGetterPropertyDescriptors(proto) {
  const fproto = Object.getOwnPropertyNames(proto)
  return fproto.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: Object.getOwnPropertyDescriptor(proto, cur),
    }),
    {}
  )
}

export default function logClass(klass: MagicalObject) {
  const descriptors = {
    ...Object.getOwnPropertyDescriptors(klass),
    ...collectGetterPropertyDescriptors(Object.getPrototypeOf(klass)),
  }
  // decorate all methods
  for (const method of Object.keys(descriptors)) {
    logClassMethod(klass, method, descriptors[method])
  }
}

function logWrapFunction(fn, method) {
  return function(...args) {
    if (this.__shouldLog) {
      console.log(this.constructor.name, method, '(', ...args, ')')
    }
    return fn.call(this, ...args)
  }
}

// * => mobx
function logClassMethod(target: Object, method: string, descriptor: Object) {
  if (!descriptor.writable) {
    return
  }

  // @computed get (do first to avoid hitting the getter on next line)
  if (descriptor && (!!descriptor.get || !!descriptor.set)) {
    if (descriptor.get) {
      descriptor.get = logWrapFunction(descriptor.get, method)
    }
    if (descriptor.set) {
      descriptor.set = logWrapFunction(descriptor.set, method)
    }
    Object.defineProperty(target, method, descriptor)
    return
  }

  let value = target[method]
  let newValue

  // let it be
  switch (typeof value) {
    case 'function':
      newValue = logWrapFunction(value, method)
      break
  }

  if (typeof newValue !== 'undefined') {
    target[method] = newValue
  }
}

window.logClass = logClass
