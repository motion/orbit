import { gloss } from '@o/gloss'
import { View, ViewProps } from '@o/ui'
import React from 'react'

import * as Constants from '../constants'

export type SectionContentProps = ViewProps & {
  outside?: React.ReactNode
  forwardRef?: any
  pages?: number
}

export const SectionContent = ({
  outside,
  children,
  zIndex,
  background,
  padding,
  height,
  flex,
  forwardRef,
  ...props
}: SectionContentProps) => {
  return (
    <Section
      width="100%"
      zIndex={zIndex}
      background={background}
      padding={padding}
      height={height}
      flex={flex}
      ref={forwardRef}
    >
      {outside}
      <SectionContentChrome flex={flex} {...props}>
        <div
          style={{
            position: 'relative',
            flex: 1,
            flexDirection: 'inherit',
            flexWrap: 'inherit',
            alignItems: 'inherit',
            justifyContent: 'inherit',
          }}
        >
          {children}
        </div>
      </SectionContentChrome>
    </Section>
  )
}

const Section = gloss(View, {
  position: 'relative',
  alignItems: 'center',
})

export const SectionContentChrome = gloss(View, {
  minHeight: '100%',
  width: '100%',
  maxWidth: Constants.widths.large,
  padding: [0, Constants.sidePad],
  position: 'relative',
  [Constants.screen.smallQuery]: {
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'auto',
    padding: [0, '5%'],
  },
})
