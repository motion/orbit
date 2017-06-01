import { view } from '~/helpers'
import Editor from '~/editor'
import * as Plugins from '~/editor/plugins'
import * as Rules from '~/editor/rules'
import { flatten } from 'lodash'

@view.ui
export default class JotEditor {
  plugins = Object.keys(Plugins).map(key => Plugins[key])
  rules = flatten(Object.keys(Rules).map(key => Rules[key]))

  render(props) {
    return <Editor plugins={this.plugins} rules={this.rules} {...props} />
  }
}

if (module.hot) {
  module.hot.accept()
}
