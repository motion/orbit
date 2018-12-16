export function proxyGet<A extends Object>(main: A, ...alternates: A[]): A {
  return new Proxy(main, {
    get(target, key) {
      console.log('get', target, key)
      const val = Reflect.get(target, key)
      if (typeof val !== 'undefined') {
        return val
      }
      for (const alt of alternates) {
        const altVal = Reflect.get(alt, key)
        console.log('returning', alt, altVal)
        if (typeof altVal !== 'undefined') {
          return altVal
        }
      }
    },
  }) as A
}
