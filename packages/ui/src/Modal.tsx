import React from 'react'
import { Portal } from './helpers/portal'
import { gloss } from '@mcro/gloss'

const ModalBackground = gloss({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1000000,
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(5px)',
})

const ModalContent = gloss({
  background: '#f7f9fa',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 2px 20px rgba(0,0,0,0.2)',
  borderRadius: 5,
  margin: 100,
})

export const Modal = ({ portalProps, bgProps, children, ...props }) => {
  return (
    <Portal {...portalProps}>
      <ModalBackground {...bgProps}>
        <ModalContent {...props}>{children}</ModalContent>
      </ModalBackground>
    </Portal>
  )
}
