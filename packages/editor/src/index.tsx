import React from 'react'

import { viewCache } from './helpers'
import { PlainEditor } from './PlainEditor'

export class Editor extends React.Component {
  state = {
    plugins: null,
  }

  start = () => {
    const NewPlugins = require('./plugins') // for hmr
    const plugins = Object.keys(NewPlugins).map(key => NewPlugins[key])
    this.setState({ plugins })
  }

  reset = () => {
    this.setState({ plugins: null }, this.start)
  }

  componentWillMount() {
    this.start()
    viewCache.add(this)
  }

  componentWillUnmount() {
    viewCache.remove(this)
  }

  render() {
    if (!plugins) {
      return null
    }
    const { getRef, ...props } = this.props
    const { plugins } = this.state
    return <PlainEditor plugins={plugins} getRef={getRef} {...props} />
  }
}

const resetAll = () => viewCache.all.forEach(value => value.reset())

if (module.hot) {
  module.hot.accept('./plugins', resetAll)
  module.hot.accept('./rules', resetAll)
}
