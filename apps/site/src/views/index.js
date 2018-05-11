export * from './shared'
export Logo from './logo'
export Header from './header'
export Footer from './footer'
export { Section, SectionContent, Slant } from './section'
export Orbitals from './orbitals'
export Sine from './sine'

import * as React from 'react'
import * as UI from '@mcro/ui'

const PurchaseDefault = (
  <React.Fragment>
    <span css={{ fontWeight: 500 }}>Early access</span> &nbsp;&middot;&nbsp;{' '}
    <span css={{ fontWeight: 800 }}>$200</span>
  </React.Fragment>
)

export const PurchaseButton = ({ children, ...props }) => (
  <UI.Button
    background="#fff"
    color="green"
    borderColor="green"
    borderWidth={2}
    size={1.1}
    fontWeight={300}
    {...props}
  >
    {children || PurchaseDefault}
  </UI.Button>
)
