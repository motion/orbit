import React from 'react'
import { MediaModal } from './MediaModal'
import { ModalProps } from './Modal'

export type GalleryModalProps = Omit<ModalProps, 'children'> & {
  images: React.ReactNode[]
}

export function GalleryModal({ images, ...props }: GalleryModalProps) {
  return (
    <MediaModal {...props}>
      {/* TODO next/prev etc */}
      {images}
    </MediaModal>
  )
}
