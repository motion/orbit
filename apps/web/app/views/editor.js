import { view } from '~/helpers'
import Editor from '~/editor'
import * as Plugins from '~/editor/plugins'
import * as Rules from '~/editor/rules'
import { flatten } from 'lodash'

const plugins = Object.keys(Plugins).map(key => Plugins[key])
const rules = flatten(Object.keys(Rules).map(key => Rules[key]))

@view.ui
export default class JotEditor {
  render(props) {
    return <Editor plugins={plugins} rules={rules} {...props} />
  }
}
