import { gloss } from '@o/ui'
import React, { memo } from 'react'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoVertical } from './LogoVertical'

export const Logos = memo((props: { show: 'horizontal' | 'vertical' }) => {
  const showHorizontal = props.show === 'horizontal'
  return (
    <LogosChrome>
      <LogoItem>
        <LogoHorizontal opacity={showHorizontal ? 1 : 0} />
      </LogoItem>
      <LogoItem>
        <LogoVertical opacity={showHorizontal ? 0 : 1} />
      </LogoItem>
    </LogosChrome>
  )
})

const LogosChrome = gloss({
  width: 200,
  height: '100%',
  position: 'relative',
})

const LogoItem = gloss({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
})
