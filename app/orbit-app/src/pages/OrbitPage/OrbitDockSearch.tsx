import { AppMainView, useActiveAppDefinition, useStore } from '@o/kit'
import { Input, Modal, ProvideVisibility } from '@o/ui'
import React from 'react'

import { DockButton } from './Dock'

class OrbitSearch {
  open = false
  toggleOpen = () => (this.open = !this.open)
}

export function OrbitDockSearch() {
  const store = useStore(OrbitSearch)
  const acceptsSearch = useAcceptsSearch()

  return (
    <>
      <DockButton id="search" visible={acceptsSearch} onClick={store.toggleOpen} icon="search" />
      <Modal width="50%" height="50%" open={store.open}>
        <Input size={1.2} placeholder="Search everything..." />
        <ProvideVisibility visible={store.open}>
          <AppMainView identifier="search" />
        </ProvideVisibility>
      </Modal>
    </>
  )
}

const useAcceptsSearch = () => {
  const def = useActiveAppDefinition()
  return !!(def.viewConfig && def.viewConfig.acceptsSearch)
}
