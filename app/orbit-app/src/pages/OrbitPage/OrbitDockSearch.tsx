import { AppMainView, useActiveAppDefinition, useStore } from '@o/kit'
import { DockButton, Input, Modal, Visibility } from '@o/ui'
import React from 'react'

class OrbitSearch {
  open = false
  setOpen = x => (this.open = x)
  toggleOpen = () => (this.open = !this.open)
}

export function OrbitDockSearch() {
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
        <Visibility visible={store.open}>
          <AppMainView identifier="search" />
        </Visibility>
      </Modal>
    </>
  )
}

const useAcceptsSearch = () => {
  const def = useActiveAppDefinition()
  return !!(def.viewConfig && def.viewConfig.acceptsSearch)
}
