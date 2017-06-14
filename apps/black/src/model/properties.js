import * as Kontur from 'kontur'

const prox = obj =>
  new Proxy(obj, {
    get(target, property) {
      switch (property) {
        case 'unique':
          target.unique = true
          return prox(target)
          break
      }
      return target[property]
    },
  })

const Properties = Object.keys(Kontur).reduce(
  (acc, cur) => ({ ...acc, [cur]: prox(Kontur[cur]) }),
  {}
)

export const { bool, array, object, str, nil } = Properties

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
  return Kontur.compile(obj)
}

window.compile = compile
window.P = Properties
window.oneOf = oneOf
