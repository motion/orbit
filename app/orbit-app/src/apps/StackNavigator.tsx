import { isEqual } from '@o/fast-compare'
import { AppProps, AppViewProps, createStoreContext, ensure, useReaction, useStore, useUserState } from '@o/kit'
import { ImmutableUpdateFn, Loading, Slider, SliderPane } from '@o/ui'
import { removeLast } from '@o/utils'
import { last, pickBy } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect, useMemo } from 'react'

// TODO split into StackNavigator in UI

export type NavigatorProps = {
  navigation: StackNavigatorStore
}

type StackItemProps = AppViewProps

type StackItem = {
  id: string
  props?: StackItemProps
}

type BaseProps = {
  defaultItem?: StackItem
  onNavigate?: (next: StackItem) => any
  items: {
    [key: string]: FunctionComponent<AppProps & NavigatorProps>
  }
}

export type StackNavigatorProps =
  | BaseProps & {
      stateId: string
    }
  | BaseProps & {
      useNavigator?: StackNavigatorStore
    }

export const StackNavigator = forwardRef<StackNavigatorStore, StackNavigatorProps>((props, ref) => {
  const stackNavParent = useStore('useNavigator' in props ? props.useNavigator : null)
  const stackNavInternal = useCreateStackNavigator(
    !stackNavParent && { id: 'stateId' in props ? props.stateId : 'default' },
  )
  // should never switch them out....
  const stackNav = stackNavParent || stackNavInternal

  if (!stackNav) {
    throw new Error('No stack navigator given, must provide one of useNavigator or stateId')
  }

  useEffect(() => {
    if (!ref || typeof ref !== 'function') return
    ref(stackNav)
  }, [stackNav, ref])

  useEffect(() => {
    if (!stackNav) return
    if (!stackNav.stack.length && props.defaultItem) {
      console.log('going to default item', props.defaultItem)
      stackNav.navigate(props.defaultItem)
    }
  }, [stackNav, props.defaultItem])

  useReaction(
    () => stackNav && stackNav.currentItem,
    stackItem => {
      ensure('props.onNavigate', !!props.onNavigate)
      props.onNavigate(stackItem)
    },
    {
      deferFirstRun: true,
    },
  )

  const stackElements = useMemo(() => {
    return stackNav.stack
      .map((stackItem, i) => {
        const View = props.items[stackItem.id]
        if (!View) {
          console.warn('no item found, id', stackItem.id, 'stack item', stackItem)
          return null
        }
        return (
          <SliderPane key={`${i}${stackItem.id}`}>
            <Suspense fallback={<Loading />}>
              <View {...stackItem.props} navigation={stackNav} />
            </Suspense>
          </SliderPane>
        )
      })
      .filter(Boolean)
  }, [stackNav.stack])

  return (
    <StackNavContext.SimpleProvider value={stackNav}>
      <Slider curFrame={stackElements.length - 1}>{stackElements}</Slider>
    </StackNavContext.SimpleProvider>
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

  navigate(item: StackItem, forcePush = false) {
    const props = filterSimpleValues(item.props)
    // dont update stack if already on same item, unless explicitly asking
    this.props.setState(next => {
      if (!next || !next.stack) {
        return
      }
      if (next.stack.length) {
        const prev = last(next.stack)
        if (item.id === prev.id && isEqual(props, prev.props)) {
          if (forcePush === false) {
            return
          }
        }
      }
      next.stack = [
        ...next.stack,
        {
          id: item.id,
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

export const useCreateStackNavigator = (props: { id: string }) => {
  const [state, setState] = useUserState<StackNavState>(`StackNavigator-${props.id}`, {
    stack: [],
  })
  return StackNavContext.useCreateStore({
    state,
    setState,
  })
}

export const useStackNavigator = StackNavContext.useStore
