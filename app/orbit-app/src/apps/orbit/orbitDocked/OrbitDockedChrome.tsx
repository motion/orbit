import * as React from 'react'
import { view } from '@mcro/black'
import { BORDER_RADIUS, CHROME_PAD } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import * as UI from '@mcro/ui'

type Props = {
  appStore: AppStore
}

const extraShadow = 100
const SHADOW_PAD = 100 + extraShadow
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.34]]

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

// Border.theme = ({ theme }) => {
//   // const borderColor = theme.base.background.lighten(0.4)
//   // const borderShadow = [0, 0, 0, 0.5, borderColor]
//   // const lightBg = theme.base.background.lighten(1)
//   // const borderGlow = ['inset', 0, 0.5, 0, 0.5, lightBg]
//   return {
//     boxShadow: [DOCKED_SHADOW /* , borderShadow */],
//   }
// }

// @ts-ignore
const Chrome = view({
  position: 'absolute',
  top: -CHROME_PAD,
  left: -CHROME_PAD,
  right: -CHROME_PAD,
  bottom: -CHROME_PAD,
  border: [CHROME_PAD, [255, 255, 255, 0.15]],
  borderRadius: BORDER_RADIUS + CHROME_PAD / 2,
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
Background.theme = ({ theme, isUpper }) => ({
  background: theme.base.background.lighten(4).alpha(0.5),
  // background: [0, 0, 0, 0.5],
  // background: isUpper
  //   ? theme.base.background.alpha(0.2)
  //   : `linear-gradient(
  //       ${theme.base.background.alpha(0.2)} 90%,
  //       ${theme.base.background.alpha(0)}
  //     )`,
})

const OrbitChrome = ({ isUpper = false }) => {
  return (
    <>
      <Border />
      <Chrome />
      <Background isUpper={isUpper} />
    </>
  )
}

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
          height: maxHeight,
          transform: `translateY(${height - maxHeight + extraShadow}px)`,
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
  // return null
  return (
    <>
      <BlockTop height={90} overflow={SHADOW_PAD}>
        <OrbitChrome isUpper />
      </BlockTop>
      <BlockBottom
        above={90}
        height={appStore.contentHeight}
        maxHeight={window.innerHeight - 20}
        overflow={SHADOW_PAD}
      >
        <OrbitChrome />
      </BlockBottom>
    </>
  )
})
