import { Space, View } from '@o/ui'
import React, { memo } from 'react'

import { Page } from '../../views/Page'
import { AboveFooter } from './AboveFooter'
import { Footer } from './Footer'
import { blackWavePattern } from './purpleWaveUrl'

export default memo(function FeetSection(props: { hideJoin?: boolean }) {
  return (
    <>
      <View
        padding="xxl"
        sm-padding={0}
        justifyContent="space-between"
        alignItems="center"
        marginTop="auto"
        minHeight={600}
      >
        <Space size="xl" />
        <View flex={3} />
        <AboveFooter hideJoin={props.hideJoin} />
        <View flex={1} />
        <Footer />
        <View flex={1} />
      </View>

      <Page.BackgroundParallax
        speed={0.2}
        zIndex={-10}
        offset={-0.2}
        backgroundSize="cover"
        left="-40%"
        right="-40%"
        width="180%"
        top="-120%"
        bottom="-190%"
        backgroundPosition="top center"
        opacity={1}
        backgroundImage={blackWavePattern}
      />
    </>
  )
})
