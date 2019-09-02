import React from 'react'

import { LinkState } from '../LinkState'
import { FadeChild, fastConfig, fastStatticConfig } from './FadeInView'
import { HeaderContext } from './HeaderContext'
import { Link } from './LinkProps'

export const HeaderLink = ({ delay, children, ...props }: any) => {
  const header = HeaderContext.useStore()
  const leaving = header && header.shown === false
  return (
    <Link width="33%" fontWeight={400} fontSize={15} {...props}>
      <FadeChild
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
      <HeaderLink delay={linkDelay * 1} {...props} href="/guides">
        Guides
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
