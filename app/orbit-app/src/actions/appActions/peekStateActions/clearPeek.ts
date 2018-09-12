import { setAppState } from '../setAppState'

export function clearPeek() {
  setAppState({
    target: null,
    peekId: 0,
    appConfig: null,
  })
}
