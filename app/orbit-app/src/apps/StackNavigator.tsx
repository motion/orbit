import { isEqual } from '@o/fast-compare'
import { AppProps, ScopedState, useStore, useUserState } from '@o/kit'
import { ImmutableUpdateFn, Slider, SliderPane } from '@o/ui'
import { last } from 'lodash'
import React, { forwardRef, FunctionComponent, useEffect } from 'react'

// TODO split into StackNavigator in UI
type NavigatorProps = {
  navigation: StackNav
}

type StackNavigatorProps = {
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
  console.log('render me....................')
  return (
    <ScopedState id={`StackNavigator-${props.id}`}>
      <StackNavigatorView ref={ref} items={props.items} />
    </ScopedState>
  )
})

type StackNavStateItem = {
  id: string
  props: Object
}

type StackNavState = {
  stack: StackNavStateItem[]
}

export class StackNav {
  props: {
    state: StackNavState
    setState: ImmutableUpdateFn<StackNavState>
  }
  navigate(id: string, props: AppProps, forcePush = false) {
    // dont update stack if already on same item, unless explicitly asking
    if (this.props.state.stack.length) {
      if (isEqual(props, last(this.props.state.stack).props)) {
        if (forcePush === false) {
          return
        }
      }
    }
    this.props.setState(next => {
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
    console.log('todo')
  }
}

const StackNavigatorView = forwardRef<StackNav, StackNavigatorProps>((props, ref) => {
  const [state, setState] = useUserState('StackNavigatorView', { stack: [] } as StackNavState)
  const stackNav = useStore(StackNav, { state, setState })
  const { stack } = state

  console.log('stack', stack)
  useEffect(() => {
    console.log('got ref', ref)
    if (ref) {
      ref['current'] = stackNav
    }
  }, [ref])

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
})
