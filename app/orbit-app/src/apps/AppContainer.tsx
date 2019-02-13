import { cloneElement, useEffect } from 'react'
import { useStores } from '../hooks/useStores'
import { AppElements } from './AppTypes'

const appViews = ['index', 'children', 'statusBar', 'toolBar', 'provideStores']

export function AppContainer(props: AppElements) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore, appsStore } = useStores()

  useEffect(() => {
    const views = {
      index: props.index && (mergeProps => cloneElement(props.index, mergeProps)),
      main: props.children && (mergeProps => cloneElement(props.children, mergeProps)),
      statusBar: props.statusBar && (mergeProps => cloneElement(props.statusBar, mergeProps)),
      toolBar: props.toolBar && (mergeProps => cloneElement(props.toolBar, mergeProps)),
    }

    appsStore.setupApp(appStore.id, views, props.provideStores)
  }, [])

  return null
}
