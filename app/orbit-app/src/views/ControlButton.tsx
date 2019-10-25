import * as UI from '@o/ui'
import { gloss } from 'gloss'
import * as React from 'react'

import controlX from '../../public/images/control-x.png'
import controlY from '../../public/images/control-y.png'
import controlZ from '../../public/images/control-z.png'

const icons = {
  x: controlX,
  y: controlY,
  z: controlZ,
}

const ControlButtonForgiveness = gloss<any>(UI.Box).theme(({ size, forgiveness }) => ({
  padding: forgiveness,
  margin: -forgiveness,
  // TODO css-typed-om CSS.px(), CSS.calc() here
  width: (size?.get() ?? 0) + forgiveness.get() * 2,
  height: (size?.get() ?? 0) + forgiveness.get() * 2,
  pointerEvents: 'auto',
  '& img': {
    opacity: 0,
  },
  '&:hover img': {
    opacity: 0.65,
  },
}))

const ControlButtonChrome = gloss(UI.Stack, {
  width: 12,
  height: 12,
  padding: 2,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
}).theme(theme => {
  const background = theme.background.darken(0.2).desaturate(0.2)
  const borderColor = theme.backgroundStronger
  return {
    background,
    boxShadow: [['inset', 0, 0, 0, theme.borderWidth, borderColor]],
  }
})

const Img = gloss('img', {
  margin: 'auto',
  width: '100%',
  height: '100%',
  cursor: 'default',
})

export const ControlButton = ({ icon, forgiveness = 3, size = 10, ...props }) => {
  return (
    <ControlButtonForgiveness forgiveness={forgiveness} size={size}>
      <ControlButtonChrome width={size} height={size} {...props}>
        <Img src={icons[icon]} />
      </ControlButtonChrome>
    </ControlButtonForgiveness>
  )
}
