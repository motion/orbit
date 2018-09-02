import * as React from 'react'
import { view } from '@mcro/black'
import { BORDER_RADIUS, CHROME_PAD } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import * as UI from '@mcro/ui'
import { Desktop } from '@mcro/stores'

type Props = {
  appStore: AppStore
}

const extraShadow = -20
const SHADOW_PAD = 100 + extraShadow
const DOCKED_SHADOW = [0, SHADOW_PAD / 6, SHADOW_PAD, [0, 0, 0, 0.5]]

const Border = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: Number.MAX_SAFE_INTEGER,
  pointerEvents: 'none',
  borderRadius: BORDER_RADIUS + 1,
})

Border.theme = ({ theme }) => {
  // const borderColor = theme.background.lighten(0.4)
  // const borderShadow = [0, 0, 0, 0.5, borderColor]
  // const lightBg = theme.background.lighten(1)
  // const borderGlow = ['inset', 0, 0.5, 0, 0.5, lightBg]
  return {
    boxShadow: [DOCKED_SHADOW /* , borderShadow */],
  }
}

// @ts-ignore
const Chrome = view({
  position: 'absolute',
  top: -CHROME_PAD,
  left: -CHROME_PAD,
  right: -CHROME_PAD,
  bottom: -CHROME_PAD,
  border: [CHROME_PAD, [255, 255, 255, 0.15]],
  borderRadius: BORDER_RADIUS + CHROME_PAD + 1,
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
  // background: 'rgba(255,255,255,0.92)',
})
Background.theme = ({ theme, isTransparent }) => {
  const isDark = theme.background.isDark()
  const darkBg = isTransparent ? [28, 28, 28, 0.5] : [40, 40, 40]
  const lightBg = isTransparent ? [255, 255, 255, 0.9] : [255, 255, 255]
  return {
    background: isDark ? darkBg : lightBg,
  }
  // background: [0, 0, 0, 0.5],
  // background: isUpper
  //   ? theme.background.alpha(0.2)
  //   : `linear-gradient(
  //       ${theme.background.alpha(0.2)} 90%,
  //       ${theme.background.alpha(0)}
  //     )`,
}

const OrbitChrome = view(({ isUpper = false }) => {
  return (
    <>
      <Border />
      <Chrome />
      <Background
        isUpper={isUpper}
        isTransparent={Desktop.state.operatingSystem.supportsTransparency}
      />
    </>
  )
})

const BlockFrame = view(UI.View, {
  pointerEvents: 'none',
  position: 'absolute',
})

const BlockTop = ({ overflow, height, children }) => (
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

const BlockBottom = ({ overflow, above, maxHeight, height, children }) => (
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
          height: maxHeight + above,
          transform: `translateY(${height - above - maxHeight + 10}px)`,
          // transition: 'transform ease-out 60ms',
        }}
      >
        {children}
      </div>
    </div>
  </BlockFrame>
)

// this view has two halves so it can animate smoothly without causing layout reflows

export const OrbitDockedChrome = view(({ appStore }: Props) => {
  return (
    <>
      <BlockTop height={60} overflow={SHADOW_PAD}>
        <OrbitChrome isUpper />
      </BlockTop>
      <BlockBottom
        above={60}
        height={appStore.contentHeight}
        maxHeight={window.innerHeight - 20}
        overflow={SHADOW_PAD}
      >
        <OrbitChrome />
      </BlockBottom>
    </>
  )
})
