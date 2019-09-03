import { gloss, Row, useTheme, View } from '@o/ui'
import { Box } from 'gloss'
import React from 'react'

import { useSiteStore } from '../SiteStore'

export const Spotlight = () => {
  const siteStore = useSiteStore()
  const theme = useTheme()
  return (
    <>
      <Above />
      <Row>
        <Left />
        <Square
          width={siteStore.sectionHeight * 0.7}
          height={siteStore.sectionHeight * 0.7}
          className="spotlight"
          zIndex={10}
          background={`radial-gradient(circle farthest-side, transparent 0%, ${theme.background})`}
        />
        <Right />
      </Row>
      <Below />
    </>
  )
}

const Square = gloss(View)

const bg = (_, theme) => ({ background: theme.background })

const Above = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Below = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Left = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Right = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)
