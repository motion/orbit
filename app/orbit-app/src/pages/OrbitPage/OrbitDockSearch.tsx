import { useActiveAppDefinition } from '@o/kit'
import { DockButton } from '@o/ui'
import React, { memo } from 'react'

import { om } from '../../om/om'

export const OrbitDockSearch = memo(() => {
  const acceptsSearch = useAcceptsSearch()

  return (
    <>
      <DockButton
        id="search"
        visible={acceptsSearch}
        onClick={() => {
          om.actions.router.showAppPage({ id: 'quickFind', toggle: 'docked' })
        }}
        icon="search"
      />
    </>
  )
})

const useAcceptsSearch = () => {
  const def = useActiveAppDefinition()
  return !!(def && def.viewConfig && def.viewConfig.acceptsSearch)
}
