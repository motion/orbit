import { superMemo } from '@mcro/ui'
import React, { useEffect } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { AppElements } from '../types/AppDefinition'

const appViews = ['index', 'children', 'statusBar', 'toolBar', 'provideStores']

function AppContainerInner(props: AppElements) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore, appsStore } = useStoresSimple()

  useEffect(() => {
    const views = {
      index: props.index && superMemo(props.index),
      main: props.children && superMemo(props.children),
      statusBar: props.statusBar && superMemo(props.statusBar),
      toolBar: props.toolBar && superMemo(props.toolBar),
    }

    appsStore.setupApp(appStore.id, views, props.provideStores)
  }, [])

  return null
}

// handle errors per-app:

export class App extends React.Component<AppElements> {
  state = {
    error: null,
  }

  componentDidMount() {}

  componentDidCatch(error) {
    console.error(this.state.error)
    this.setState({
      error,
    })
  }

  render() {
    if (this.state.error) {
      console.warn('has error')
    }
    return <AppContainerInner {...this.props} />
  }
}
