import * as React from 'react'
import { storeOptions } from './store'
import storeProvidable from '@mcro/decor/lib/plugins/react/storeProvidable'

const storeDecorator = storeProvidable(storeOptions).decorator

export default class ProvideStore extends React.Component {
  componentWillMount() {
    const PassThrough = props => props.children(props)
    this.Child = storeDecorator(PassThrough, {
      stores: { store: this.props.store },
    })
  }

  render() {
    const { Child } = this
    const { storeProps } = this.props
    return (
      <Child {...storeProps}>
        {props => {
          return this.props.children(props.store)
        }}
      </Child>
    )
  }
}
