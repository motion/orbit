import { FullScreen, View } from '@o/ui'
import React from 'react'

import { useIsTiny } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { EarlyAccessContent } from './EarlyAccessContent'
import { LineSep } from './LineSep'

export default function EarlyAccessSection({ outside = null }: any) {
  const isTiny = useIsTiny()
  return (
    <>
      <Page.Content
        zIndex={10}
        outside={
          <>
            <FullScreen background={theme => theme.background} top={80} />
            <LineSep top={-20} fill />
            <LineSep
              top="auto"
              bottom={0}
              height={120}
              left={0}
              right={0}
              width="100%"
              minWidth={1200}
              transform={{ scaleX: -1 }}
              zIndex={1}
            />
            {outside}
          </>
        }
      >
        <View margin={['auto', 0]} padding={[20, 0]} transform={{ y: isTiny ? 0 : '-5%' }}>
          <EarlyAccessContent />
        </View>
      </Page.Content>
    </>
  )
}
