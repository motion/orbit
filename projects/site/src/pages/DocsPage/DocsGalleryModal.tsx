import { Button, GalleryModal } from '@o/ui'
import React, { useState } from 'react'

export let Basic = () => {
  let [open, setOpen] = useState(false)
  return (
    <>
      <GalleryModal
        title="My Modal"
        subTitle="Some Sub Title"
        pad
        open={open}
        onClickBackground={() => setOpen(false)}
      >
        <Button size={2} icon="home">
          Hello World
        </Button>
      </GalleryModal>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
    </>
  )
}
