import { Space, View } from '@o/ui'
import React, { memo } from 'react'

import { Page } from '../../views/Page'
import { AboveFooter } from './AboveFooter'
import { Footer } from './Footer'
import { blackWavePattern } from './purpleWaveUrl'

export default memo(function FeetSection() {
  return (
    <>
      <View padding="xxl" justifyContent="space-between" alignItems="center">
        <Space size="xl" />
        <AboveFooter />
        <View flex={1} />
        <Footer />
      </View>

      <Page.BackgroundParallax
        speed={0.1}
        zIndex={-10}
        bottom="-110%"
        backgroundSize="cover"
        left="-40%"
        right="-40%"
        width="180%"
        top="-50%"
        backgroundPosition="top center"
        opacity={1}
        backgroundImage={blackWavePattern}
      />
    </>
  )
})
