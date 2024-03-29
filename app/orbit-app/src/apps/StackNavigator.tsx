import { isEqual } from '@o/fast-compare'
import { createStoreContext, ensure, react, useHooks, useReaction, useStore, useUserState } from '@o/kit'
import { Loading, Slider, SliderPane } from '@o/ui'
import { removeLast } from '@o/utils'
import { last, pickBy } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect, useMemo } from 'react'

// TODO split into StackNavigator in UI

export type NavigatorProps = {
  navigation: StackNavigatorStore
}

type StackItem = {
  id: string
  props?: { [key: string]: string | number | boolean | null | undefined }
}

type BaseProps = {
  defaultItem?: StackItem
  onNavigate?: (next: StackItem) => any
}

type StackNavProps = BaseProps & {
  id: string | false
  items: {
    [key: string]: FunctionComponent<NavigatorProps & any>
  }
}

export type StackNavViewProps =
  | StackNavProps
  | BaseProps & {
      useNavigator?: StackNavigatorStore
    }

export const StackNavigator = forwardRef<StackNavigatorStore, StackNavViewProps>((props, ref) => {
  const stackNavParent = useStore('useNavigator' in props ? props.useNavigator : null)
  // TODO our type intersections are odd
  const id = 'id' in props ? props.id : false
  const stackNavInternal = useCreateStackNavigator(
    'useNavigator' in props ? false : { id, items: props['items'], ...props },
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
    if (!stackNav || !props.defaultItem || !id) {
      return
    }
    stackNav.updateDefaultItem(props.defaultItem)
  }, [stackNav, props.defaultItem, id])

  useReaction(
    () => stackNav && stackNav.currentItem,
    stackItem => {
      ensure('stackItem', !!stackItem)
      if (props.onNavigate) {
        props.onNavigate(stackItem)
      }
    },
    {
      lazy: true,
    },
  )

  const stackElements = useMemo(() => {
    return stackNav.stack
      .map((stackItem, i) => {
        const View = stackNav.items[stackItem.id]
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
    <StackNavContext.ProvideStore value={stackNav}>
      <Slider curFrame={stackElements.length - 1}>{stackElements}</Slider>
    </StackNavContext.ProvideStore>
  )
})

StackNavigator.defaultProps = {
  id: 'default',
}

type StackNavState = {
  stack: StackItem[]
}

export class StackNavigatorStore {
  // @ts-ignore
  props: StackNavProps

  // next stack item
  nextItem = null

  private hooks = useHooks(() => {
    const id = this.props.id ? `sn-${this.props.id}` : false
    const [state, setState] = useUserState<StackNavState>(id, {
      stack: [],
    })
    return {
      state,
      setState,
    }
  })

  get items() {
    return this.props.items
  }

  get stack() {
    return (this.hooks.state && this.hooks.state.stack) || []
  }

  get currentItem() {
    return this.stack[this.stack.length - 1]
  }

  propUpdateDefaultItem = react(
    () => [this.props.defaultItem, this.props.id, this.hooks.state],
    ([item, id, state]) => {
      ensure('id', !!id)
      ensure('state', !!state)
      item && this.updateDefaultItem(item)
    },
  )

  updateDefaultItem(defaultItem: StackItem) {
    if (!this.stack.length && defaultItem) {
      this.navigateTo(defaultItem)
    }
  }

  private filterItem<A extends StackItem>(item: A): A {
    return {
      ...item,
      props: filterSimpleValues(item.props),
    }
  }

  // push item on stack
  // dont update if already on same item, unless forcePush
  navigateTo(
    item: StackItem,
    { forcePush = false, replaceAll = false }: { forcePush?: boolean; replaceAll?: boolean } = {},
  ) {
    this.hooks.setState(current => {
      if (!current) return
      if (!current.stack) {
        current.stack = []
      }
      const next = this.filterItem(item)
      if (!replaceAll && current.stack.length) {
        const prev = last(current.stack)
        if (prev && item.id === prev.id && isEqual(next.props, prev.props) && forcePush === false) {
          return
        }
      }
      if (replaceAll) {
        current.stack = [item]
      } else {
        current.stack.push(next)
      }
    })
  }

  back() {
    this.hooks.setState(next => {
      next.stack = removeLast(next.stack)
    })
  }
}

const filterSimpleValues = obj =>
  pickBy(obj, val => typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean')

const StackNavContext = createStoreContext(StackNavigatorStore)

export const useCreateStackNavigator = (props: StackNavProps | false) => {
  // ensure we remount it on id change
  return StackNavContext.useCreateStore(props, { id: `${props ? props['id'] : false}` })
}

export const useStackNavigator = StackNavContext.useStore
