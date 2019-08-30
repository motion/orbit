import { View, ViewProps } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

import * as Constants from '../constants'

export type SectionContentProps = ViewProps & {
  outside?: React.ReactNode
  forwardRef?: any
  pages?: number
}

const style = {
  position: 'relative',
  flex: 1,
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
} as const

export const SectionContent = ({
  outside,
  children,
  zIndex,
  background,
  padding,
  height,
  flex,
  minHeight,
  forwardRef,
  ...props
}: SectionContentProps) => {
  return (
    <Section
      zIndex={zIndex}
      background={background}
      padding={padding}
      height={height}
      flex={flex}
      minHeight={minHeight}
      nodeRef={forwardRef}
    >
      {outside}
      <SectionContentChrome flex={flex} {...props}>
        <div style={{ width: '100%', display: 'flex', flexFlow: 'column', ...style }}>
          {children}
        </div>
      </SectionContentChrome>
    </Section>
  )
}

const Section = gloss(View, {
  width: '100%',
  position: 'relative',
  alignItems: 'center',
})

export const SectionContentChrome = gloss(View, {
  minHeight: '100%',
  width: '100%',
  maxWidth: Constants.widths.large,
  paddingLeft: Constants.sidePad,
  paddingRight: Constants.sidePad,
  position: 'relative',
  [Constants.screen.smallQuery]: {
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'auto',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
})
