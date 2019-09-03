import { FullScreen, View } from '@o/ui'
import React from 'react'

import { useIsTiny } from '../../hooks/useScreenSize'
import { EarlyAccessContent } from './EarlyAccessContent'
import { LineSep } from './LineSep'

export default function EarlyAccessSection({ outside = null }: any) {
  const isTiny = useIsTiny()
  return (
    <>
      <FullScreen top={40} />
      <LineSep
        top="auto"
        bottom={0}
        height={120}
        left={'-20%'}
        right={0}
        width="130%"
        minWidth={1200}
        transform={{ scaleX: -1 }}
        zIndex={1}
        opacity={0.2}
      />
      {outside}
      <View margin={['auto', 0]} padding={[20, 0]} transform={{ y: isTiny ? 0 : '-5%' }}>
        <EarlyAccessContent />
      </View>
    </>
  )
}
