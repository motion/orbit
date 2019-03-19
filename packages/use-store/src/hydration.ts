import { AutomagicStore } from '@o/automagical'
import { isEqual } from '@o/fast-compare'

export type HydrationState = {
  decorations: AutomagicStore['__automagic']['decorations']
  values: Object
}

export function dehydrate(store: AutomagicStore): HydrationState {
  const { decorations } = store.__automagic
  return {
    decorations,
    values: Object.keys(decorations).reduce((acc, key) => {
      if (decorations[key] === 'ref') {
        acc[key] = store[key]
      }
      return acc
    }, {}),
  }
}

export function hydrate(
  store: AutomagicStore,
  previousInitialState: HydrationState,
  previousState: HydrationState,
) {
  const { decorations } = store.__automagic
  for (const key of Object.keys(decorations)) {
    const val = decorations[key]
    if (val !== 'ref') continue
    // if hasn't changed initial state value, restore it
    if (isEqual(previousInitialState.values[key], store[key])) {
      store[key] = previousState.values[key]
    }
  }
}
