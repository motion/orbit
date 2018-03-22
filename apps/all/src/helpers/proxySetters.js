const getStateKey = key => {
  let unSet = `${key.replace('set', '')}`
  const unCapital = `${unSet[0].toLowerCase()}${unSet.slice(1)}`
  return unCapital
}

export default function decorateProxySetters(klass) {
  return new Proxy(klass, {
    get(target, method) {
      if (Reflect.has(target, method)) {
        return target[method]
      }
      console.log('method', method)
      if (method.indexOf('set') === 0) {
        const stateKey = getStateKey(method)
        if (typeof target.state[stateKey] !== 'undefined') {
          return nextState => {
            return target.setState({ [stateKey]: nextState })
          }
        } else {
          throw new Error(
            `Attempted a setState on a key that doesn't exist! ${method}`,
          )
        }
      }
    },
  })
}
