import { cloneElement, useEffect } from 'react';
import { useStoresSafe } from '../hooks/useStoresSafe';
import { AppElements } from './AppTypes';

const appViews = ['index', 'children', 'statusBar', 'toolBar']

export function AppContainer(props: AppElements) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore, appsStore } = useStoresSafe()

  useEffect(() => {
    appsStore.handleAppViews(appStore.id, {
      index: props.index && (mergeProps => cloneElement(props.index, mergeProps)),
      main: props.children && (mergeProps => cloneElement(props.children, mergeProps)),
      statusBar: props.statusBar && (mergeProps => cloneElement(props.statusBar, mergeProps)),
      toolBar: props.toolBar && (mergeProps => cloneElement(props.toolBar, mergeProps)),
    })
  }, [])

  return null
}
