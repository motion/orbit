import { useEffect } from 'react'
import { superMemo } from '../helpers/memoIsEqualDeep'
import { useStoresSimple } from '../hooks/useStores'
import { AppElements } from './AppTypes'

const appViews = ['index', 'children', 'statusBar', 'toolBar', 'provideStores']

export function AppContainer(props: AppElements) {
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
