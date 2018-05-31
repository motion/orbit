import autobind from 'autobind-decorator'

export function autobound() {
  return {
    name: 'autobind',
    once: true,
    onlyClass: true,
    decorator: Klass => {
      return autobind(Klass)
    },
  }
}
