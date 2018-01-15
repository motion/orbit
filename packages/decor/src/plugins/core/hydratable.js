import * as Mobx from 'mobx'

export default function hydratable() {
  return {
    name: 'hydratable',
    once: true,
    onlyClass: true,
    decorator: (Klass, { filter = x => x !== 'props' } = {}) => {
      Klass.prototype.hydrate = function hydrate(state) {
        for (const key of Object.keys(state).filter(filter)) {
          this[key] = state[key]
        }
      }

      Klass.prototype.dehydrate = function dehydrate() {
        if (this.$mobx) {
          let state = {}
          const storeKeys = Object.keys(this.$mobx.values).filter(filter)
          for (const key of storeKeys) {
            if (Mobx.isComputed(this, key)) {
              continue
            }
            if (Mobx.isAction(this, key)) {
              continue
            }
            state[key] = this[key]
          }
          return state
        }
        return null
      }
    },
  }
}
