import { useLayoutEffect } from 'react'

import { AppChildViews } from './AppNavigator'

export function AppToolBar(props: { children: React.ReactNode }) {
  const appChildViews = AppChildViews.useStore()

  useLayoutEffect(() => {
    appChildViews.setItems({
      toolBar: props.children,
    })
  }, [])

  return null
}
