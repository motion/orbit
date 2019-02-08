import { cloneElement, useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'

export type AppViews = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
}

const appViews = ['index', 'children', 'statusBar', 'toolBar']

export function App(props: AppViews) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore, appsStore } = useStoresSafe()

  useEffect(() => {
    console.log('setting app store views', props)
    appsStore.handleAppViews(+appStore.id, {
      index: props.index && (mergeProps => cloneElement(props.index, mergeProps)),
      main: props.children && (mergeProps => cloneElement(props.children, mergeProps)),
      statusBar: props.statusBar && (mergeProps => cloneElement(props.statusBar, mergeProps)),
      toolBar: props.toolBar && (mergeProps => cloneElement(props.toolBar, mergeProps)),
    })
  }, [])

  return null
}
