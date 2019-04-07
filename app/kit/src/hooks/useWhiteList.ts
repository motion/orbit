import { ScopedAppState } from './useAppState'

export function useWhiteList(
  [state, update]: ScopedAppState<any>,
  opts: { getAll: () => string[] },
) {
  return {
    isWhitelisting: !!state,
    toggleActive() {
      if (state) {
        update(undefined)
      } else {
        update(opts.getAll())
      }
    },
    getWhitelisted(id: string) {
      if (!state) return true
      if (Array.isArray(state)) {
        return state.includes(id)
      }
      return state[id]
    },
    toggleWhitelisted(id: string) {
      const next = state || opts.getAll()
      const index = next.indexOf(id)
      if (index === -1) {
        next.push(id)
      } else {
        next.splice(index, 1)
      }
      update(next)
    },
  }
}

export type WhiteList = ReturnType<typeof useWhiteList>
