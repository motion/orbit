import { gloss } from '@mcro/gloss'
import React, { createContext, useContext } from 'react'
import { AppElements } from '../types/AppDefinition'

const validAppProps = ['index', 'children', 'statusBar', 'toolBar', 'context']

export const AppLoadContext = createContext({
  identifier: '',
  id: '',
})

export const AppViewsContext = createContext({
  Toolbar: null,
  Statusbar: null,
  Main: null,
  Sidebar: null,
})

function AppContainerInner(props: AppElements) {
  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { id, identifier } = useContext(AppLoadContext)

  if (!identifier || !id) {
    console.error('Internal bug, we didnt set context id + identifier')
  }

  const { Statusbar, Main, Sidebar, Toolbar } = useContext(AppViewsContext)

  return (
    <>
      <Statusbar />
      <Main />
      <Sidebar />
      <Toolbar />
    </>
  )
}

// handle errors per-app:

export class App extends React.Component<AppElements> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.error(this.state.error)
    this.setState({
      error,
    })
  }

  render() {
    if (this.state.error) {
      console.warn(this.state.error)
      return <RedBox>{this.state.error}</RedBox>
    }
    return <AppContainerInner {...this.props} />
  }
}

const RedBox = gloss({
  flex: 1,
  minHeight: 100,
  minWidth: 300,
  background: 'red',
  color: 'white',
  fontFamily: 'monospace',
  whiteSpace: 'pre',
  overflow: 'scroll',
})
