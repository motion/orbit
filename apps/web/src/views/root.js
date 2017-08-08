import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import Redbox from 'redbox-react'
import RootStore from './rootStore'
import Router from '~/router'
const { ipcRenderer } = (window.require && window.require('electron')) || {}
import * as Constants from '~/constants'

@view.provide({
  rootStore: RootStore,
})
export default class Root extends React.Component {
  state = {
    error: null,
  }

  clearErr = () => {
    this.setState({ error: null })
  }

  componentDidMount() {
    view.on('hmr', this.clearErr)

    this.watch(() => {
      if (User.org === null) {
        console.log('CREATE AN ORG WITH User.createOrg(\'yourorgname\')')
      }
    })

    // listen to Ionize
    if (Constants.APP_KEY) {
      log('WERE AN APP WINDOW')
      this.on(window, 'focus', () => {
        console.log('ask where to go')
        ipcRenderer.send('where-to', Constants.APP_KEY)
      })

      ipcRenderer.on('app-goto', (event, arg) => {
        console.log('appgoto', arg)
        Router.go(arg)
      })
    }
  }

  componentWillUnmount() {
    view.off('hmr', this.clearErr)
  }

  unstable_handleError(error) {
    this.setState({ error })
    console.error('ERR', error)
  }

  clearErrors() {
    this.setState({ error: null })
  }

  render({ rootStore }) {
    if (this.state.error) {
      return <Redbox $$draggable error={this.state.error} />
    }
    return (
      <HotKeys keyMap={rootStore.shortcuts}>
        <HotKeys attach={window} focused handlers={rootStore.actions}>
          {this.props.children}
        </HotKeys>
      </HotKeys>
    )
  }
}
