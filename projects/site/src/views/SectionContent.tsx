import { View, ViewProps } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

import * as Constants from '../constants'

export type SectionContentProps = ViewProps & {
  outside?: React.ReactNode
  forwardRef?: any
  pages?: number | 'auto'
  readablePage?: boolean
}

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
  readablePage,
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
      <SectionContentChrome flex={flex} readablePage={readablePage} {...props}>
        {children}
      </SectionContentChrome>
    </Section>
  )
}

const Section = gloss(View, {
  width: '100%',
  position: 'relative',
  alignItems: 'center',
})

export const SectionContentChrome = gloss<{ readablePage?: boolean }>(View, {
  minHeight: '100%',
  maxHeight: '100%',
  // alignItems: 'center',
  width: '100%',
  maxWidth: Constants.widths.lg,
  paddingLeft: Constants.sidePad,
  paddingRight: Constants.sidePad,
  position: 'relative',

  readablePage: {
    maxWidth: Constants.widths.md,
  },

  [Constants.mediaQueries.sm]: {
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'auto',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
})
