import { View, ViewProps } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

import { mediaQueries, sidePad, widths } from '../constants'

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
    <BlogSection
      zIndex={zIndex}
      background={background || 'transparent'}
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
    </BlogSection>
  )
}

const BlogSection = gloss(View, {
  width: '100%',
  position: 'relative',
  alignItems: 'center',
})

export const SectionContentChrome = gloss<{ readablePage?: boolean }, ViewProps>(View, {
  minHeight: '100%',
  maxHeight: '100%',
  // alignItems: 'center',
  width: '100%',
  maxWidth: '100vw',
  paddingLeft: sidePad,
  paddingRight: sidePad,
  position: 'relative',

  readablePage: {
    maxWidth: widths.md,
  },

  [mediaQueries.lg]: {
    maxWidth: widths.lg,
  },

  [mediaQueries.sm]: {
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'auto',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
})
