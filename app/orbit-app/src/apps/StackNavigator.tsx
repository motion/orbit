import { AppProps, AppViewProps, createStoreContext, useHooks, useStore, useUserState } from '@o/kit'
import { Loading, Slider, SliderPane } from '@o/ui'
import { removeLast } from '@o/utils'
import { last } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect, useRef } from 'react'

// TODO split into StackNavigator in UI
export type NavigatorProps = {
  navigation: StackNavigatorStore
}

type StackItemProps = AppViewProps

type StackNavigatorProps = {
  defaultItem?: { id: string; props: StackItemProps }
  items: {
    [key: string]: FunctionComponent<AppProps & NavigatorProps>
  }
}

export const StackNavigator = forwardRef<
  StackNavigatorStore,
  | StackNavigatorProps & {
      id: string
    }
  | StackNavigatorProps & {
      useNavigator?: StackNavigatorStore
    }
>((props, ref) => {
  const stackNavParent = 'useNavigator' in props ? props.useNavigator : null
  const stackNavLocal = useStore(StackNavigatorStore, 'id' in props ? { id: props.id } : undefined)
  const stackNav = stackNavParent || stackNavLocal

  const { stack } = stackNav

  useEffect(() => {
    if (!ref || typeof ref !== 'function') return
    ref(stackNav)
  }, [ref])

  const has = useRef(false)
  useEffect(() => {
    if (!stackNav.stack.length && props.defaultItem) {
      if (has.current) return
      has.current = true
      console.log('should navigate', props.defaultItem.id, props.defaultItem.props)
      stackNav.navigate(props.defaultItem.id, props.defaultItem.props)
    }
  }, [props.defaultItem])

  return (
    <Slider curFrame={stack.length - 1}>
      {stack.map((stackItem, i) => {
        const View = props.items[stackItem.id]
        return (
          <SliderPane key={`${i}${stackItem.id}`}>
            <Suspense fallback={<Loading />}>
              <View {...stackItem.props} navigation={stackNav} />
            </Suspense>
          </SliderPane>
        )
      })}
    </Slider>
  )
})

type StackNavStateItem = {
  id: string
  props: { [key: string]: any }
}

type StackNavState = {
  stack: StackNavStateItem[]
}

type StackNavUse = {
  id: string
}

export class StackNavigatorStore {
  props: StackNavUse
  next = null
  hooks = useHooks({
    userState: () =>
      useUserState<StackNavState>(`StackNavigator-${this.props.id}`, {
        stack: [],
      }),
  })

  get stack() {
    return this.hooks.userState[0].stack || []
  }

  get setState() {
    return this.hooks.userState[1]
  }

  get currentItem() {
    return this.stack[this.stack.length - 1]
  }

  navigate(id: string, props: AppViewProps, forcePush = false) {
    // dont update stack if already on same item, unless explicitly asking
    if (this.stack.length) {
      const prev = last(this.stack)
      if (id === prev.id) {
        if (forcePush === false) {
          return
        }
      }
    }
    this.setState(next => {
      if (!next) {
        console.warn('no item?')
        return
      }
      console.log('adding to', next)
      next.stack = [
        ...next.stack,
        {
          id,
          props,
        },
      ]
    })
  }

  back() {
    this.setState(next => {
      next.stack = removeLast(next.stack)
    })
  }
}

const StackNavContext = createStoreContext(StackNavigatorStore)
export const useStackNavigator = StackNavContext.useCreateStore
