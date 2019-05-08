import React from 'react'

import { LinkState } from '../pages/HomePage/linkProps'
import { FadeChild, fastConfig, fastStatticConfig } from './FadeIn'
import { HeaderContext } from './HeaderContext'
import { Link } from './LinkProps'

export const HeaderLink = ({ delay, children, ...props }: any) => {
  const header = HeaderContext.useProps()
  const leaving = header && header.shown === false
  return (
    <Link width="33%" fontWeight={500} fontFamily="GT Eesti" fontSize={16} {...props}>
      <FadeChild
        willAnimateOnHover
        off={!LinkState.didAnimateOut}
        delay={leaving ? 0 : delay}
        config={leaving ? fastStatticConfig : fastConfig}
      >
        {children}
      </FadeChild>
    </Link>
  )
}
const linkDelay = 80
export const LinksLeft = props => {
  return (
    <>
      <HeaderLink delay={linkDelay * 1} {...props} href="/docs">
        Start
      </HeaderLink>
      <HeaderLink delay={linkDelay * 2} {...props} href="/docs">
        Docs
      </HeaderLink>
      <HeaderLink delay={linkDelay * 3} {...props} href="/apps">
        Apps
      </HeaderLink>
    </>
  )
}
export const LinksRight = props => (
  <>
    <HeaderLink delay={linkDelay * 4} {...props} href="/beta">
      Beta
    </HeaderLink>
    <HeaderLink delay={linkDelay * 5} {...props} href="/blog">
      Blog
    </HeaderLink>
    <HeaderLink delay={linkDelay * 6} {...props} href="/about">
      About
    </HeaderLink>
  </>
)
