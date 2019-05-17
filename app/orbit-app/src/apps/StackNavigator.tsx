import { AppProps, useStore, useUserState } from '@o/kit'
import { ImmutableUpdateFn, Loading, Slider, SliderPane } from '@o/ui'
import { removeLast } from '@o/utils'
import { last } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect } from 'react'

// TODO split into StackNavigator in UI
export type NavigatorProps = {
  navigation: StackNav
}

type StackItemProps = AppProps

type StackNavigatorProps = {
  useNavigator?: StackNav
  defaultItem?: { id: string; props: StackItemProps }
  items: {
    [key: string]: FunctionComponent<AppProps & NavigatorProps>
  }
}

export const StackNavigator = forwardRef<
  StackNav,
  StackNavigatorProps & {
    id: string
  }
>((props, ref) => {
  const [state, setState] = useUserState(`StackNavigator-${props.id}`, {
    stack: [],
  } as StackNavState)
  const stackNav = props.useNavigator || useStore(StackNav, { state, setState })
  const { stack } = stackNav

  useEffect(() => {
    if (!ref) return
    ref['current'] = stackNav
  }, [ref])

  useEffect(() => {
    if (!stackNav.stack.length && props.defaultItem) {
      stackNav.navigate(props.defaultItem.id, props.defaultItem.props)
    }
  }, [])

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
  state: StackNavState
  setState: ImmutableUpdateFn<StackNavState>
}

export class StackNav {
  props: StackNavUse
  next = null

  get stack() {
    return this.props.state.stack || []
  }

  navigate(id: string, props: AppProps, forcePush = false) {
    // dont update stack if already on same item, unless explicitly asking
    if (this.stack.length) {
      const prev = last(this.stack)
      if (id === prev.id) {
        if (forcePush === false) {
          return
        }
      }
    }
    this.props.setState(next => {
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
    this.props.setState(next => {
      next.stack = removeLast(next.stack)
    })
  }
}
