import React from 'react'
import { storeOptions } from './store'
import storeProvidable from '@mcro/decor/es6/plugins/react/storeProvidable'

const storeDecorator = storeProvidable(storeOptions).decorator
const PassThrough = props => props.children(props)

export class ProvideStore extends React.Component {
  props: {
    storeProps: Object
    children: Function
    store: any
  }

  Child = storeDecorator(PassThrough, {
    stores: { store: this.props.store },
  })

  render() {
    const { Child } = this
    const { storeProps, children } = this.props
    return <Child {...storeProps}>{props => children(props.store)}</Child>
  }
}
