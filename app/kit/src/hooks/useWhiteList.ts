import { useAppState } from './useAppState'

export function useWhiteList(uid: string, opts: { getAll: () => string[] }) {
  const [state, update] = useAppState(uid, [])

  return {
    isWhitelisting: !!state.length,
    toggleActive() {
      update(next => {
        if (next.length) {
          return []
        }
        return opts.getAll()
      })
    },
    getWhitelisted(id: string) {
      if (!state) return true
      return state.includes(id)
    },
    toggleWhitelisted(id: string) {
      update(next => {
        const list = next.length ? next : opts.getAll()
        const index = list.indexOf(id)
        if (index === -1) {
          list.push(id)
        } else {
          list.splice(index, 1)
        }
        return list
      })
    },
  }
}

export type WhiteList = ReturnType<typeof useWhiteList>
