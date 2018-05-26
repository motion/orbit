import { setInterval, setTimeout, on, ref } from '@mcro/helpers'

export function utilityUsable() {
  return {
    name: 'mobx-reactable',
    once: true,
    onlyClass: true,
    decorator: Klass => {
      Object.assign(Klass.prototype, {
        ref,
        on,
        setInterval,
        setTimeout,
      })
    },
  }
}
