import { AppMainView, useActiveAppDefinition, useStore } from '@o/kit'
import { DockButton, Input, Modal, ProvideVisibility } from '@o/ui'
import React, { memo } from 'react'

class OrbitSearch {
  open = false
  setOpen = x => (this.open = x)
  toggleOpen = () => (this.open = !this.open)
}

export const OrbitDockSearch = memo(() => {
  const store = useStore(OrbitSearch)
  const acceptsSearch = useAcceptsSearch()

  return (
    <>
      <DockButton id="search" visible={acceptsSearch} onClick={store.toggleOpen} icon="search" />
      <Modal
        width="50%"
        height="50%"
        open={store.open}
        onChangeOpen={store.setOpen}
        onClickBackground={store.toggleOpen}
      >
        <Input borderWidth={0} size={2} placeholder="Search everything..." />
        <ProvideVisibility visible={store.open}>
          <AppMainView identifier="search" />
        </ProvideVisibility>
      </Modal>
    </>
  )
})

const useAcceptsSearch = () => {
  const def = useActiveAppDefinition()
  return !!(def && def.viewConfig && def.viewConfig.acceptsSearch)
}
