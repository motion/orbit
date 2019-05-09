import { AppMainView, useStore } from '@o/kit'
import { Input, Modal } from '@o/ui'
import React from 'react'

import { DockButton } from './Dock'

class OrbitSearch {
  open = false
  toggleOpen = () => (this.open = !this.open)
}

export function OrbitSearchModal({ index }: { index: number }) {
  const store = useStore(OrbitSearch)

  return (
    <>
      <DockButton onClick={store.toggleOpen} index={index} icon="search" />
      <Modal width="50%" height="50%" open={store.open}>
        <Input size={1.2} placeholder="Search everything..." />

        <AppMainView identifier="search" />
      </Modal>
    </>
  )
}
