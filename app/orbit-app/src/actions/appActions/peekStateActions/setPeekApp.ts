import { AppConfig } from '@o/kit'
import invariant from 'invariant'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import { peekPosition, Position } from '../../../helpers/peekPosition'
import { setAppState } from '../setAppState'

type PeekApp = {
  target: HTMLDivElement
  appConfig: AppConfig
  parentBounds?: Position
  position?: [number, number]
  size?: [number, number]
}

// using this ensures it clears old properties
// because App.setState merges not replaces
const DEFAULT_APP_CONFIG: AppConfig = {
  id: '',
  identifier: 'home',
  title: '',
  icon: '',
  subType: '',
}

const getParentBounds = (target: HTMLDivElement) => {
  const node = target.closest('.app-parent-bounds') as HTMLDivElement
  if (!node) {
    console.error('No node to find parent bounds!')
    return null
  }
  return node.getBoundingClientRect()
}

export function setPeekApp({ target, appConfig, parentBounds, position, size }: PeekApp) {
  invariant(appConfig, 'Must pass appConfig')
  setPeekState({
    target,
    appConfig,
    parentBounds: parentBounds || target ? getParentBounds(target) : null,
    position,
    size,
  })
}

function setPeekState({ target, appConfig, parentBounds, position, size }: PeekApp) {
  const realTarget = getTargetPosition(target)

  // TODO: we need a non-deep merge option for [Store].setState
  // because this pattern is too awkward and brittle
  // perhaps [Store].replaceState or [Store].setState(x, { replace: true })

  const appState = {
    appConfig: {
      ...DEFAULT_APP_CONFIG,
      ...appConfig,
    },
    target: realTarget,
    position,
    size,
    ...(!position && !size
      ? peekPosition(realTarget, appConfig, parentBounds || realTarget)
      : null),
  }

  setAppState(appState)
}
