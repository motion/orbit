import * as React from 'react'
import { PeekPaneProps } from '../PeekPaneProps'
import * as ViewPanes from './viewPanes'

export const PeekView = ({ appConfig, children }: PeekPaneProps) => {
  if (!appConfig || !ViewPanes[appConfig.subType]) {
    console.log('no view or item', appConfig, ViewPanes)
    return children({})
  }
  const View = ViewPanes[appConfig.subType]
  return children({
    title: appConfig.title,
    content: <View appConfig={appConfig} />,
  })
}
