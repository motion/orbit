import * as React from 'react'
import { view } from '@mcro/black'
import { BORDER_RADIUS, CHROME_PAD } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import * as UI from '@mcro/ui'

type Props = {
  appStore: AppStore
}

const SHADOW_PAD = 120
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.35]]

const Border = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: Number.MAX_SAFE_INTEGER,
  pointerEvents: 'none',
  borderRadius: BORDER_RADIUS,
})

Border.theme = ({ theme }) => {
  const borderColor = theme.base.background.darken(0.45)
  const borderShadow = [0, 0, 0, 0.5, borderColor]
  const lightBg = theme.base.background.lighten(1)
  const borderGlow = ['inset', 0, 0.5, 0, 0.5, lightBg]
  return {
    boxShadow: [borderShadow, borderGlow, DOCKED_SHADOW],
  }
}

const Chrome = view({
  position: 'absolute',
  top: -CHROME_PAD,
  left: -CHROME_PAD,
  right: -CHROME_PAD,
  bottom: -CHROME_PAD,
  border: [CHROME_PAD, [0, 0, 0, 0.05]],
  borderRadius: BORDER_RADIUS + CHROME_PAD - 1,
  zIndex: -1,
})

const Background = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  borderRadius: BORDER_RADIUS + 1,
})
Background.theme = ({ theme }) => ({
  background: theme.base.background,
})

const OrbitChrome = () => {
  return (
    <>
      <Border />
      <Chrome />
      <Background />
    </>
  )
}

const BlockFrame = view(UI.View, {
  pointerEvents: 'none',
  position: 'absolute',
})

const BlockBottom = ({ overflow, height, children }) => (
  <BlockFrame top={-overflow} right={-overflow} left={-overflow}>
    <div
      style={{
        height: overflow + height,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: overflow,
          left: overflow,
          right: overflow,
          bottom: -height,
        }}
      >
        {children}
      </div>
    </div>
  </BlockFrame>
)

const BlockTop = ({ overflow, above, maxHeight, height, children }) => (
  <BlockFrame top={above} right={-overflow} left={-overflow}>
    <div
      style={{
        height: maxHeight,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -overflow,
          left: overflow,
          right: overflow,
          height: maxHeight,
          transform: `translateY(${height - maxHeight}px)`,
          transition: 'transform ease-out 60ms',
        }}
      >
        {children}
      </div>
    </div>
  </BlockFrame>
)

// this view has two halves so it can animate smoothly without causing layout reflows

export const OrbitDockedChrome = view(({ appStore }: Props) => {
  return null
  return (
    <>
      <BlockBottom height={90} overflow={SHADOW_PAD}>
        <OrbitChrome />
      </BlockBottom>
      <BlockTop
        above={90}
        height={appStore.contentHeight + 20}
        maxHeight={window.innerHeight - 20}
        overflow={SHADOW_PAD}
      >
        <OrbitChrome />
      </BlockTop>
    </>
  )
})
