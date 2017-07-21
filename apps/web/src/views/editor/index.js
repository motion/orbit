import { view } from '@mcro/black'
import { viewCache } from '~/helpers'
import React from 'react'
import PlainEditor from './plainEdtor'

@view.ui
export default class JotEditor {
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

  render({ getRef, ...props }, { plugins }) {
    if (!plugins) {
      return null
    }

    return <PlainEditor plugins={plugins} getRef={getRef} {...props} />
  }
}

const resetAll = () => viewCache.all.forEach(value => value.reset())

if (module.hot) {
  module.hot.accept('./plugins', resetAll)
  module.hot.accept('./rules', resetAll)
}
