import { useLayoutEffect } from 'react'

import { AppChildViews } from './AppNavigator'

export function AppStatusBar(props: { children: React.ReactNode }) {
  const appChildViews = AppChildViews.useStore()

  useLayoutEffect(() => {
    appChildViews.setItems({
      statusBar: props.children,
    })
  }, [])

  return null
}
