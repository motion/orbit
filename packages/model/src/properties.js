import * as Kontur from 'kontur'

function proxyProperty(obj) {
  return new Proxy(obj, {
    get(target, property) {
      switch (property) {
        case 'unique':
          return setProp(target, 'unique')
        case 'indexed':
          return setProp(target, 'index')
        case 'primary':
          return setProp(target, 'primary')
      }
      if (property === 'optional') {
        return proxyProperty(target[property])
      }
      return target[property]
    },
  })
}

function setProp(Target, prop) {
  if (!Target.s) {
    const next = new Target()
    next.s[prop] = true
    return proxyProperty(next)
  }
  Target.s[prop] = true
  return proxyProperty(Target)
}

const Properties = Object.keys(Kontur).reduce(
  (acc, cur) => ({ ...acc, [cur]: proxyProperty(Kontur[cur]) }),
  {},
)

export const { bool, array, object, str, nil, number, int } = Properties
export const string = Properties.str

export const oneOf = klass =>
  class ref {
    constructor(initial = {}) {
      this.s = initial
    }

    get optional() {
      this._optional = true
      return this
    }

    static get optional() {
      return new this().optional
    }

    static schema() {
      return {
        schema: {
          ref: klass.settings.database,
          type: 'string',
        },
      }
    }

    schema() {
      return {
        schema: this.s,
        optional: this._optional,
      }
    }
  }

export function compile(obj) {
  const compiled = Kontur.compile(obj)
  for (const key of Object.keys(compiled.properties)) {
    const prop = compiled.properties[key]
    // 🐛 fix rxdb doesn't like primary to also have required, which kontur does automatically
    if (prop.primary) {
      compiled.required = compiled.required.filter(k => k !== key)
    }
  }
  return compiled
}

if (module && module.hot) {
  module.hot.accept('.', () => {})
}

// TEST :)
// console.log(
//   compile({
//     first: str,
//     draft: str.primary,
//     other: str,
//     another: str,
//   })
// )
