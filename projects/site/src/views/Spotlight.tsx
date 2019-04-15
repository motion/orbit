import { gloss, Row, useTheme, View } from '@o/ui'
import React from 'react'
import { useSiteStore } from '../Layout'

export const Spotlight = () => {
  const siteStore = useSiteStore()
  const theme = useTheme()
  return (
    <>
      <Above />
      <Row>
        <Left />
        <Square
          width={siteStore.sectionHeight + 100}
          height={siteStore.sectionHeight}
          className="spotlight"
          zIndex={10}
          background={`radial-gradient(circle farthest-side, transparent 40%, ${theme.background})`}
        />
        <Right />
      </Row>
      <Below />
    </>
  )
}

const Square = gloss(View)

const bg = (_, theme) => ({ background: theme.background })

const Above = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Below = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Left = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Right = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)
