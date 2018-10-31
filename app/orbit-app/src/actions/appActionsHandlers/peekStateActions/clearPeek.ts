import { setAppState } from '../setAppState'

export function clearPeek() {
  setAppState({
    target: null,
    appConfig: null,
  })
}
