import { gloss } from '@o/gloss'
import { View, ViewProps } from '@o/ui'
import React from 'react'
import * as Constants from '../constants'

export type SectionContentProps = ViewProps & { outside?: React.ReactNode }

export const SectionContent = ({ outside, children, zIndex, ...props }: SectionContentProps) => {
  return (
    <Section width="100%" zIndex={zIndex}>
      {outside}
      <SectionContentChrome {...props}>
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
  width: '100%',
  minWidth: Constants.smallSize,
  maxWidth: Constants.mediumSize,
  padding: [0, Constants.sidePad],
  position: 'relative',
  pointerEvents: 'none',
  '& > *': {
    pointerEvents: 'auto',
  },
  [Constants.screen.smallQuery]: {
    width: '100%',
    // height: 'auto',
    minWidth: 'auto',
    maxWidth: 'auto',
    padding: [0, '5%'],
  },
  padHorizontal: {
    paddingLeft: Constants.sidePad,
    paddingRight: Constants.sidePad,
    [Constants.screen.smallQuery]: {
      paddingLeft: '5%',
      paddingRight: '5%',
    },
  },
}).theme(({ padding }) => ({
  paddingTop: padding !== true ? padding : 80,
  paddingBottom: padding !== true ? padding : 80,
}))
