import { createContextualProps } from '@o/ui'

const ScopedStateContext = createContextualProps({
  id: '',
})

export const useScopedStateId = () => {
  const val = ScopedStateContext.useProps()
  return (val && val.id) || ''
}

export const ScopedState = ScopedStateContext.PassProps
