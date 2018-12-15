export function proxyGet<A extends Object>(main: A, ...alternates: A[]): A {
  return new Proxy(main, {
    get(target, key) {
      if (typeof target[key] !== 'undefined') {
        return target[key]
      }
      for (const alt of alternates) {
        if (typeof alt[key] !== 'undefined') {
          return alt[key]
        }
      }
    },
  }) as A
}
