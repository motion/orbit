import { react, useStore } from '@o/use-store'
import React, { forwardRef } from 'react'
import { useOnMount } from './hooks/useOnMount'

type StackProps = {
  frame?: number
  children?: React.ReactNode
}

class StackStore {
  props: StackProps

  frame = this.props.frame || 0
  stack = this.props.children || []

  syncStackProp = react(() => this.props.children, x => (this.stack = x))
  syncFrameProp = react(() => this.props.frame, x => (this.frame = x))
}

export const Stack = forwardRef<StackStore, StackProps>(function Stack(props, stackRef) {
  const store = useStore(StackStore, props)

  useOnMount(() => {
    stackRef['current'] = store
  })

  console.log('store.stack', store.stack)

  return null

  // return (
  //   <>
  //     <Slider curFrame={store.frame}>{store.stack.map(stackItem => ({ stackItem }))}</Slider>
  //   </>
  // )
})
