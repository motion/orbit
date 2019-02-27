import { gloss } from '@mcro/gloss'
import { superMemo } from '@mcro/ui'
import React, { createContext, useContext, useEffect } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { AppElements } from '../types/AppDefinition'

const appViews = ['index', 'children', 'statusBar', 'toolBar', 'provideStores']

export const AppLoadContext = createContext({
  identifier: '',
  id: '',
})

function AppContainerInner(props: AppElements) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { id, identifier } = useContext(AppLoadContext)
  const { appsStore } = useStoresSimple()

  if (!identifier || !id) {
    throw new Error('Internal bug, we didnt set context id + identifier')
  }

  useEffect(() => {
    appsStore.setApp({
      id,
      identifier,
      views: {
        index: props.index && superMemo(props.index),
        main: props.children && superMemo(props.children),
        statusBar: props.statusBar && superMemo(props.statusBar),
        toolBar: props.toolBar && superMemo(props.toolBar),
      },
      provideStores: props.provideStores,
    })
  }, [])

  return null
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
