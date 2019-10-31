import { BorderRight, Stack } from '@o/ui'
import React, { memo } from 'react'

import { useScreenSize } from '../hooks/useScreenSize'
import { useStickySidebar } from './useStickySidebar'

export const DocsPageSidebar = memo(({ children, ...rest }: any) => {
  const screen = useScreenSize()
  useStickySidebar({
    condition: screen !== 'small',
    id: '#sidebar',
    containerSelector: '#main',
  })
  return (
    <Stack id="sidebar" width={230} pointerEvents="auto" height="100vh" {...rest}>
      <Stack position="relative" className="sidebar__inner" flex={1}>
        <Stack margin={[0, 0, 0]} flex={1} position="relative">
          {children}
          <BorderRight opacity={0.5} top={10} />
        </Stack>
      </Stack>
    </Stack>
  )
})
