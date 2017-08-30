import * as Kontur from 'kontur'

const prox = obj =>
  new Proxy(obj, {
    get(target, property) {
      switch (property) {
        case 'unique':
          target.isUnique = true
          return target
        case 'indexed':
          target.isIndexed = true
          return target
        case 'primary':
          target.isPrimary = true
          return target
      }
      return target[property]
    },
  })

const Properties = Object.keys(Kontur).reduce(
  (acc, cur) => ({ ...acc, [cur]: prox(Kontur[cur]) }),
  {}
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
  const orig = { ...obj }
  const kontured = Kontur.compile(obj)

  // monkey patch poorly
  for (const key of Object.keys(obj)) {
    if (orig[key].isIndexed) {
      kontured.properties[key].index = true
    }
    if (orig[key].isUnique) {
      kontured.properties[key].uniqueItems = true
    }
    if (orig[key].isPrimary) {
      kontured.properties[key].primary = true
    }
  }

  return kontured
}

module.hot.accept(() => {})
// TEST :)
// console.log(
//   compile({
//     draft: str.primary,
//   })
// )
