import { setAppState } from '../setAppState'

export function clearPeek() {
  setAppState({
    target: null,
    peekId: null,
    appConfig: null,
  })
}
