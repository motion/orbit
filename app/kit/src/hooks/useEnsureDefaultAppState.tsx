import { useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { isDefined } from '@o/utils'
import { useEffect } from 'react'

export function useEnsureDefaultAppState<A>(identifier: string | false, ensure: A) {
  const [state, update] = useModel(StateModel, {
    where: {
      type: 'app',
      identifier,
    },
  })
  useEffect(() => {
    if (!identifier) return
    if (!state) return
    if (!isDefined(state.data[identifier])) return
    if (!isDefined(ensure)) return
    update(next => {
      // ensure default
      next.data = ensure
    })
  }, [state])
}
