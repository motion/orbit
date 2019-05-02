import { gloss } from '@o/gloss'
import { View, ViewProps } from '@o/ui'
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
      ref={forwardRef}
    >
      {outside}
      <SectionContentChrome flex={flex} {...props}>
        <div style={style as any}>{children}</div>
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
  padding: [0, Constants.sidePad],
  position: 'relative',
  [Constants.screen.smallQuery]: {
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'auto',
    padding: [0, '5%'],
  },
})
