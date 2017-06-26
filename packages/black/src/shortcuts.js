import { Shortcuts as ReactShortcuts, ShortcutManager } from 'react-shortcuts'
import view from './view'

export { ShortcutManager } from 'react-shortcuts'

@view.ui
export class Shortcuts {
  render() {
    return (
      <ReactShortcuts $shortcuts isolate alwaysFireHandler {...this.props} />
    )
  }
  static style = {
    shortcuts: {
      height: '100%',
      width: '100%',
    },
  }
}
