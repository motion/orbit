// helper, when you have:
// Klass.state = { something: {} }
// to automatically add a function:
// Klass.setSomething(value)

// ALSO does Klass.orbitState => Klass.state.orbitState
// only if State is a postfix for the state key

export function proxySetters(klass) {
  return new Proxy(klass, {
    get(target, key) {
      if (Reflect.has(target, key)) return Reflect.get(target, key)
      if (typeof key !== 'string') return
      if (key.indexOf('State') && target.state[key]) {
        return target.state[key]
      }
      if (key.indexOf('set') === 0) {
        const s = key.slice(3)
        const skey = `${s[0].toLowerCase()}${s.slice(1)}`
        if (klass.state[skey]) {
          return next => klass.setState({ [skey]: next })
        }
      }
    },
  })
}
