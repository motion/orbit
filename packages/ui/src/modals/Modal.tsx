import { gloss } from '@o/gloss'
import React from 'react'
import { Button } from '../buttons/Button'
import { Portal } from '../helpers/portal'
import { Section, SectionProps } from '../Section'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { SurfaceProps } from '../Surface'
import { View, ViewProps } from '../View/View'

export type ModalProps = SimpleModalProps & {
  backgroundProps?: ViewProps
  children?: React.ReactNode
  chromeless?: boolean
}

export function Modal({ backgroundProps, background, children, chromeless, ...props }: ModalProps) {
  return (
    <Portal>
      <ModalBackground background={background} {...backgroundProps}>
        {chromeless && children}
        {!chromeless && <SimpleModal {...props}>{children}</SimpleModal>}
      </ModalBackground>
    </Portal>
  )
}

export type SimpleModalProps = SectionProps &
  SizedSurfaceProps & {
    shown?: boolean
    onClose?: () => any
  }

function SimpleModal({
  title,
  subTitle,
  scrollable,
  above,
  pad,
  children,
  shown,
  afterTitle,
  onClose,
  ...props
}: SimpleModalProps) {
  return (
    <PopoverChrome
      sizeRadius={1}
      hoverStyle={null}
      activeStyle={null}
      overflow="hidden"
      elevation={10}
      noInnerElement
      minWidth={200}
      minHeight={200}
      shown={shown}
      {...props}
    >
      <Section
        title={title}
        subTitle={subTitle}
        afterTitle={
          <>
            {afterTitle || null}
            {!!onClose && <Button chromeless icon="cross" size={1.5} onClick={() => onClose()} />}
          </>
        }
        scrollable={scrollable}
        above={above}
        pad={pad}
      >
        {children}
      </Section>
    </PopoverChrome>
  )
}

const PopoverChrome = gloss<SurfaceProps & { shown?: boolean }>(SizedSurface, {
  opacity: 0,
  pointerEvents: 'none',
  shown: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})

const ModalBackground = gloss(View, {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 1000000,
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'all',
  // backdropFilter: 'blur(5px)',
}).theme(({ background }) => ({
  background: background || 'rgba(0, 0, 0, 0.3)',
}))
