import React from 'react'
import { Omit } from '../types'
import { MediaModal } from './MediaModal'
import { ModalProps } from './Modal'

export type MedialModalProps = Omit<ModalProps, 'children'> & {
  images: React.ReactNode[]
}

export function GalleryModal({ images, ...props }: ModalProps) {
  return (
    <MediaModal {...props}>
      {/* TODO next/prev etc */}
      {images}
    </MediaModal>
  )
}
