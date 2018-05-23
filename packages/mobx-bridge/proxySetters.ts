export function proxySetters(klass) {
  for (const stateKey of Object.keys(klass.state)) {
    // klass.setXState
    const setKey = `set${stateKey[0].toUpperCase()}${stateKey.slice(1)}`
    klass[setKey] = nextState => {
      return klass.setState({ [stateKey]: nextState })
    }
    // klass.XState => klass.state.XState
    if (stateKey.indexOf('State') === stateKey.length - 5) {
      Object.defineProperty(klass, stateKey, {
        get: function() {
          return klass.state[stateKey]
        },
      })
    }
  }
  return klass
}
