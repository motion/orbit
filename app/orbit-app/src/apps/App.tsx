import { cloneElement, useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'

type AppProps = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
}

const appViews = ['index', 'children']

export function App(props: AppProps) {
  for (const key in props) {
    if (!appViews.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore, appsStore } = useStoresSafe()

  useEffect(() => {
    console.log('setting app store views', props)
    appsStore.handleAppViews(+appStore.id, {
      index: mergeProps => cloneElement(props.index, mergeProps),
      main: mergeProps => cloneElement(props.children, mergeProps),
    } as any)
  }, [])

  return null
}
