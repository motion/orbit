import { Sidebar, SidebarProps } from '@o/ui'
import React, { Fragment } from 'react'
import { useScreenSize } from '../../hooks/useScreenSize'

export function FloatSidebar({ children, ...sidebarProps }: SidebarProps) {
  const screen = useScreenSize()

  const detail = <Fragment key="detail">{children}</Fragment>

  if (screen === 'small') {
    return <Sidebar floating zIndex={10000000} elevation={5} {...sidebarProps} />
  }

  return detail
}
