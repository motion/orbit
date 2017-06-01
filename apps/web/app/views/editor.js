import React from 'react'
import { view, observable } from '~/helpers'
import Editor from '~/editor'
import * as Plugins from '~/editor/plugins'
import * as Rules from '~/editor/rules'
import { flatten } from 'lodash'

@view.ui
export default class JotEditor extends React.Component {
  state = {
    schema: {},
  }

  start = () => {
    const Plugs = require('../editor/plugins')
    const schema = {
      plugins: Object.keys(Plugs).map(key => Plugs[key]),
      rules: flatten(Object.keys(Rules).map(key => Rules[key])),
    }
    this.setState({ schema })
  }

  reset = () => {
    this.setState({ schema: null }, this.start)
  }

  componentWillMount() {
    window.x = this
    this.start()
    // if (module.hot) {
    //   module.hot.accept('../editor/plugins', this.props.store.reset)
    //   module.hot.accept('../editor/rules', this.props.store.reset)
    // }
  }

  render(props, { schema }) {
    if (!schema) {
      console.log('render null')
      return null
    }
    return (
      <Editor
        key={Math.random()}
        plugins={schema.plugins}
        rules={schema.rules}
        {...props}
      />
    )
  }
}

if (module.hot) {
  module.hot.accept('../editor/plugins', () => window.x.reset())
  // module.hot.accept('../editor/rules', () => window.x.props.store.reset())
}
