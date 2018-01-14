export default function hydratable() {
  return {
    name: 'hydratable',
    once: true,
    onlyClass: true,
    decorator: Klass => {
      Klass.prototype.hydrate = function hydrate(state) {
        for (const key of Object.keys(state)) {
          this[key] = state[key]
        }
      }

      Klass.prototype.dehydrate = function dehydrate() {
        if (this.$mobx) {
          let state = {}
          for (const key of Object.keys(this.$mobx.values)) {
            state[key] = this[key]
          }
          return state
        }
        return null
      }
    },
  }
}
