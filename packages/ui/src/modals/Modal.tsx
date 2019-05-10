import { gloss } from 'gloss'
import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'

import { Button } from '../buttons/Button'
import { Portal } from '../helpers/portal'
import { Section, SectionProps } from '../Section'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { SurfaceProps } from '../Surface'
import { View, ViewProps } from '../View/View'

export type SimpleModalProps = SectionProps &
  SizedSurfaceProps & {
    open?: boolean
    onChangeOpen?: (next: boolean) => any
    closable?: boolean
  }

export type ModalProps = SimpleModalProps & {
  onClickBackground?: React.MouseEventHandler<HTMLDivElement>
  backgroundProps?: ViewProps
  children?: React.ReactNode
  chromeless?: boolean
}

const modalKeyMap = {
  esc: 'close',
}

export function Modal({
  backgroundProps,
  onClickBackground,
  background,
  children,
  chromeless,
  ...props
}: ModalProps) {
  return (
    <Portal
      prepend
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: Number.MAX_SAFE_INTEGER,
        pointerEvents: 'none',
      }}
    >
      {props.open && (
        <GlobalHotKeys
          keyMap={modalKeyMap}
          handlers={{ close: props.onChangeOpen.bind(null, false) }}
        />
      )}
      <ModalBackground
        onClick={onClickBackground}
        open={props.open}
        background={background}
        {...backgroundProps}
      >
        {chromeless && children}
        {!chromeless && <SimpleModal {...props}>{children}</SimpleModal>}
      </ModalBackground>
    </Portal>
  )
}

function SimpleModal({
  title,
  subTitle,
  scrollable,
  above,
  pad,
  children,
  open,
  afterTitle,
  onChangeOpen,
  closable,
  ...props
}: SimpleModalProps) {
  return (
    <ModalSizedSurface
      sizeRadius={1}
      hoverStyle={null}
      activeStyle={null}
      overflow="hidden"
      elevation={10}
      noInnerElement
      minWidth={200}
      minHeight={200}
      open={open}
      onClick={e => e.stopPropagation()}
      {...props}
    >
      <Section
        title={title}
        subTitle={subTitle}
        afterTitle={
          <>
            {afterTitle || null}
            {!!closable && (
              <Button chromeless icon="cross" size={1.5} onClick={() => onChangeOpen(false)} />
            )}
          </>
        }
        scrollable={scrollable}
        above={above}
        pad={pad}
      >
        {children}
      </Section>
    </ModalSizedSurface>
  )
}

const ModalSizedSurface = gloss<SurfaceProps & { open?: boolean }>(SizedSurface, {
  opacity: 0,
  pointerEvents: 'none',
  open: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})

const ModalBackground = gloss<ViewProps & { open?: boolean }>(View, {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 1000000,
  justifyContent: 'center',
  alignItems: 'center',
  open: {
    pointerEvents: 'auto',
  },
}).theme(({ background, open }) => ({
  background: open ? background || 'rgba(0, 0, 0, 0.3)' : 'transparent',
}))
