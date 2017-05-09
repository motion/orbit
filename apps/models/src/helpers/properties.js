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

export function compile(obj) {
  return Kontur.compile(obj)
}
