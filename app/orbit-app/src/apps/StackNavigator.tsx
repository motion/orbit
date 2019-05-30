import { isEqual } from '@o/fast-compare'
import { AppProps, AppViewProps, createStoreContext, useReaction, useStore, useUserState } from '@o/kit'
import { ImmutableUpdateFn, Loading, Slider, SliderPane } from '@o/ui'
import { removeLast } from '@o/utils'
import { last, pickBy } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect } from 'react'

// TODO split into StackNavigator in UI

export type NavigatorProps = {
  navigation: StackNavigatorStore
}

type StackItemProps = AppViewProps

type StackItem = {
  id: string
  props: StackItemProps
}

type BaseProps = {
  defaultItem?: StackItem
  onNavigate: (next: StackItem) => any
  items: {
    [key: string]: FunctionComponent<AppProps & NavigatorProps>
  }
}

export type StackNavigatorProps =
  | BaseProps & {
      id: string
    }
  | BaseProps & {
      useNavigator?: StackNavigatorStore
    }

export const StackNavigator = forwardRef<StackNavigatorStore, StackNavigatorProps>((props, ref) => {
  const stackNavParent = useStore('useNavigator' in props ? props.useNavigator : null)
  // should never switch them out....
  const stackNav = stackNavParent || useStackNavigator({ id: 'id' in props ? props.id : 'none' })

  const { stack } = stackNav

  useEffect(() => {
    if (!ref || typeof ref !== 'function') return
    ref(stackNav)
  }, [ref])

  useEffect(() => {
    if (!stackNav.stack.length && props.defaultItem) {
      stackNav.navigate(props.defaultItem.id, props.defaultItem.props)
    }
  }, [props.defaultItem])

  useReaction(
    () => stackNav.currentItem,
    stackItem => {
      props.onNavigate(stackItem)
    },
  )

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

type StackNavUseProps = {
  state: StackNavState
  setState: ImmutableUpdateFn<StackNavState>
}

export class StackNavigatorStore {
  props: StackNavUseProps
  next = null

  get stack() {
    return this.props.state.stack || []
  }

  get currentItem() {
    return this.stack[this.stack.length - 1]
  }

  navigate(id: string, rawProps: AppViewProps, forcePush = false) {
    const props = filterSimpleValues(rawProps)
    // dont update stack if already on same item, unless explicitly asking
    this.props.setState(next => {
      if (!next || !next.stack) {
        return
      }
      if (next.stack.length) {
        const prev = last(next.stack)
        if (id === prev.id && isEqual(props, prev.props)) {
          if (forcePush === false) {
            return
          }
        }
      }
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
    this.props.setState(next => {
      next.stack = removeLast(next.stack)
    })
  }
}

const filterSimpleValues = obj =>
  pickBy(obj, val => typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean')

const StackNavContext = createStoreContext(StackNavigatorStore)

export const useStackNavigator = (props: { id: string }) => {
  const [state, setState] = useUserState<StackNavState>(`StackNavigator-${props.id}`, {
    stack: [],
  })
  return StackNavContext.useCreateStore({
    state,
    setState,
  })
}
