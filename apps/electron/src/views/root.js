import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import * as RootHelpers from './rootHelpers'
import Windows from './windows'

@view.provide({
  rootStore: class RootStore {
    error = null
    appRef = null

    willMount() {
      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        this.emit('shortcut', shortcut)
      })
      RootHelpers.listenForAuth.call(this)
      RootHelpers.listenForOpenBrowser.call(this)
      RootHelpers.listenForCrawlerInject.call(this)
      RootHelpers.injectRepl({ rootStore: this })
    }

    handleAppRef = ref => {
      if (ref) {
        this.appRef = ref.app
      }
    }
  },
})
@view.electron
export default class Root extends React.Component {
  componentDidCatch(error) {
    console.error(error)
    this.props.rootStore.error = error
  }

  render({ rootStore }) {
    if (rootStore.error) {
      return null
    }
    return (
      <App onBeforeQuit={rootStore.onBeforeQuit} ref={rootStore.handleAppRef}>
        <Windows />
      </App>
    )
  }
}
