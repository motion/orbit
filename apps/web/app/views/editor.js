import { view, observable, viewCache } from '@jot/black'
import React from 'react'
import Editor from '~/editor'
import * as Plugins from '~/editor/plugins'
import { flatten } from 'lodash'

@view.ui
export default class JotEditor extends React.Component {
  state = {
    plugins: null,
  }

  start = () => {
    const NewPlugins = require('../editor/plugins') // for hmr
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

  render(props, { plugins }) {
    if (!plugins) {
      return null
    }
    return <Editor plugins={plugins} {...props} />
  }
}

const resetAll = () => viewCache.all.forEach(value => value.reset())

if (module.hot) {
  module.hot.accept('../editor/plugins', resetAll)
  module.hot.accept('../editor/rules', resetAll)
}
