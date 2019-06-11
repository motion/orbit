import React, { memo } from 'react'

import { createContextualProps } from './createContextualProps'

/**
 * Useful for having a scoped id that nests as it goes downwards
 * See useUserState/useAppState for good examples using it
 */

type ScopedStateProps = {
  id: string
}

const Context = createContextualProps<ScopedStateProps>({
  id: '',
})

export const useScopedStateId = () => {
  const val = Context.useProps()
  return (val && val.id) || ''
}

export const ScopedState = memo((props: ScopedStateProps & { children?: any }) => {
  const existing = Context.useProps()
  return (
    <Context.PassProps id={`${existing ? existing.id : ''}${props.id}`}>
      {props.children}
    </Context.PassProps>
  )
})
