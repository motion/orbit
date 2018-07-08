import { observer } from 'mobx-react'

export function reactObservable() {
  return {
    name: 'observer',
    once: true,
    // onlyClass: true,
    decorator: Klass => {
      return observer(Klass)
    },
  }
}
