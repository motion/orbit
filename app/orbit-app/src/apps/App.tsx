import { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'

type AppProps = {
  index?: React.ReactNode
  children?: React.ReactNode
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
      index: () => props.index,
      main: () => props.children,
    } as any)
  }, [])

  return null
}
