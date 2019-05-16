import { AppProps, ensure, react, ScopedState, useStore, useUserState } from '@o/kit'
import { ImmutableUpdateFn, Loading, Slider, SliderPane } from '@o/ui'
import { last } from 'lodash'
import React, { forwardRef, FunctionComponent, Suspense, useEffect } from 'react'

// TODO split into StackNavigator in UI
export type NavigatorProps = {
  navigation: StackNav
}

type StackNavigatorProps = {
  useNavigator?: StackNav
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
  const stackNav = props.useNavigator || useStore(StackNav)

  useEffect(() => {
    if (!ref) return
    ref['current'] = stackNav
  }, [ref])

  return (
    <ScopedState id={`StackNavigator-${props.id}`}>
      <Suspense fallback={<Loading />}>
        <StackNavigatorView items={props.items} useNavigator={stackNav} />
      </Suspense>
    </ScopedState>
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
  state: StackNavUse['state'] = null
  setState: ImmutableUpdateFn<StackNavState> = null
  next = null

  setUse(next: StackNavUse) {
    this.state = next.state
    this.setState = next.setState
  }

  updateNavigation = react(
    () => [this.next, this.state],
    () => {
      ensure('next', !!this.next)
      ensure('state', !!this.state)
      ensure('setState', !!this.setState)
      const { id, props, forcePush } = this.next
      // dont update stack if already on same item, unless explicitly asking
      if (this.state.stack.length) {
        const prev = last(this.state.stack)
        if (id === prev.id) {
          if (forcePush === false) {
            return
          }
        }
      }
      this.setState(next => {
        next = next || this.state // weird bugfix
        next.stack = [
          ...next.stack,
          {
            id,
            props,
          },
        ]
      })
      this.next = null
    },
  )

  navigate(id: string, props: AppProps, forcePush = false) {
    this.next = { id, props, forcePush }
  }

  back() {
    console.log('todo')
  }
}

const StackNavigatorView = (props: StackNavigatorProps) => {
  const [state, setState] = useUserState('StackNavigatorView', { stack: [] } as StackNavState)
  const stackNav = props.useNavigator
  const { stack } = state

  useEffect(() => {
    if (state) {
      stackNav.setUse({ state, setState })
    }
  }, [state, setState, stackNav])

  // this would push the first item automatically onto stack
  // useEffect(() => {
  //   if (!stack.length) {
  //     setState(next => {
  //       const firstId = Object.keys(props.items)[0]
  //       next.stack = [
  //         {
  //           id: firstId,
  //           props: {},
  //         },
  //       ]
  //     })
  //   }
  // }, [stack])

  return (
    <Slider curFrame={stack.length - 1}>
      {stack.map((stackItem, i) => {
        const View = props.items[stackItem.id]
        console.log('stackItem', stackItem)
        return (
          <SliderPane key={`${i}${stackItem.id}`}>
            <View {...stackItem.props} navigation={stackNav} />
          </SliderPane>
        )
      })}
    </Slider>
  )
}
