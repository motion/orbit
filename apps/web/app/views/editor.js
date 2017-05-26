import { view } from '~/helpers'
import Editor from '~/editor'
import * as Plugins from '~/editor/plugins'

const plugins = Object.keys(Plugins).map(key => Plugins[key])

@view.ui
export default class JotEditor {
  render(props) {
    return <Editor plugins={plugins} {...props} />
  }
}
