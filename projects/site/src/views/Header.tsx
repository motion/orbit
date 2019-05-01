import { gloss, useTheme } from '@o/gloss'
import { BorderBottom, Button, createContextualProps, Row, RowProps } from '@o/ui'
import React, { memo, useState } from 'react'

import { useIsTiny, useScreenSize } from '../hooks/useScreenSize'
import { LinkState } from '../pages/HomePage/linkProps'
import { useScreenVal } from '../pages/HomePage/SpacedPageContent'
import { useSiteStore } from '../SiteStore'
import { defaultConfig, FadeChild, fastConfig, fastStatticConfig, useFadePage } from './FadeIn'
import { Link } from './LinkProps'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoVertical } from './LogoVertical'
import { SectionContent } from './SectionContent'

export const HeaderContext = createContextualProps<{ setShown?: Function; shown?: boolean }>()

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

const LinkRow = gloss({
  flexFlow: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export const Header = memo(
  ({ slim, noBorder, ...rest }: { slim?: boolean; noBorder?: boolean } & RowProps) => {
    const isTiny = useIsTiny()
    const size = useScreenSize()
    const theme = useTheme()
    const siteStore = useSiteStore()
    const [shown, setShown] = useState(true)
    const Fade = useFadePage({ shown, threshold: 0 })

    let before = null
    let after = null

    if (size !== 'small') {
      before = (
        <LinkRow>
          <LinksLeft />
        </LinkRow>
      )
      after = (
        <LinkRow>
          <LinksRight />
        </LinkRow>
      )
    }

    let children
    const menuElement = size === 'small' && (
      <Button
        position="fixed"
        top={3}
        right={10}
        zIndex={1000000000}
        icon="menu"
        iconSize={16}
        size={2}
        chromeless
        onClick={siteStore.toggleSidebar}
      />
    )

    if (slim) {
      children = (
        <Fade.FadeProvide>
          {menuElement}
          <Row
            ref={Fade.ref}
            pointerEvents="auto"
            background={theme.background.lighten(0.05)}
            position="relative"
            zIndex={1000000}
            {...rest}
          >
            <HeaderContain height={50}>
              <LinkSection alignRight>{before}</LinkSection>
              <FadeChild
                off={!LinkState.didAnimateOut}
                config={shown ? defaultConfig : fastStatticConfig}
                delay={shown ? 0 : 0}
              >
                <LogoHorizontal slim />
              </FadeChild>
              <LinkSection>{after}</LinkSection>
            </HeaderContain>
            {!noBorder && <BorderBottom opacity={0.5} />}
          </Row>
        </Fade.FadeProvide>
      )
    } else {
      children = (
        <Fade.FadeProvide>
          {menuElement}
          <Row
            ref={Fade.ref}
            position={isTiny ? 'relative' : 'absolute'}
            top={0}
            left={0}
            right={0}
            zIndex={1000000}
            alignItems="center"
            justifyContent="space-around"
            padding={[30, 0]}
            {...rest}
          >
            <HeaderContain>
              <LinkSection alignRight>{before}</LinkSection>
              <FadeChild
                off={!LinkState.didAnimateOut}
                config={shown ? defaultConfig : fastStatticConfig}
                delay={shown ? 100 : 0}
              >
                <LogoVertical />
              </FadeChild>
              <LinkSection>{after}</LinkSection>
            </HeaderContain>
          </Row>
        </Fade.FadeProvide>
      )
    }

    return (
      <HeaderContext.PassProps setShown={setShown} shown={shown}>
        {children}
      </HeaderContext.PassProps>
    )
  },
)

export const HeaderContain = props => {
  return (
    <SectionContent
      padding={[0, useScreenVal('0%', '1%', '10%')]}
      flexFlow="row"
      alignItems="center"
      justifyContent="space-around"
      {...props}
    />
  )
}

export const LinkSection = gloss({
  flex: 4,
  flexFlow: 'row',
  justifyContent: 'space-between',
  maxWidth: 380,
  alignItems: 'center',

  padding: [0, '3%', 0, '1%'],

  alignRight: {
    padding: [0, '1%', 0, '3%'],
  },
})
