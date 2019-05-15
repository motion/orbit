import { createContextualProps } from '@o/ui'
import React from 'react'

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

// nests downwards...
export const ScopedState = (props: ScopedStateProps & { children?: any }) => {
  const existing = Context.useProps()
  return (
    <Context.PassProps id={`${existing ? existing.id : ''}${props.id}`}>
      {props.children}
    </Context.PassProps>
  )
}
