import * as React from 'react'
import { view, compose } from '@mcro/black'
import { BORDER_RADIUS, CHROME_PAD } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import * as UI from '@mcro/ui'
import { Desktop } from '@mcro/stores'
import { QueryStore } from '../../../stores/QueryStore'

type Props = {
  appStore?: AppStore
  queryStore?: QueryStore
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

Border.theme = () => {
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
  transition: 'all ease 250ms',
})
Background.theme = ({ theme, isTransparent, moreOpaque }) => {
  const isDark = theme.background.isDark()
  const darkBg = isTransparent
    ? moreOpaque
      ? [30, 30, 30, 0.55]
      : [0, 0, 0, 0.3]
    : [40, 40, 40]
  const lightBg = isTransparent
    ? [255, 255, 255, moreOpaque ? 0.9 : 0.8]
    : [255, 255, 255]
  return {
    background: isDark ? darkBg : lightBg,
  }
}

const OrbitChrome = view(({ moreOpaque, isUpper = false }) => {
  return (
    <>
      <Border />
      <Chrome />
      <Background
        isUpper={isUpper}
        isTransparent={Desktop.state.operatingSystem.supportsTransparency}
        moreOpaque={moreOpaque}
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

const decorator = compose(
  view.attach('appStore', 'queryStore'),
  view,
)

export const OrbitDockedChrome = decorator(
  ({ appStore, queryStore }: Props) => {
    return (
      <>
        <BlockTop height={60} overflow={SHADOW_PAD}>
          <OrbitChrome isUpper moreOpaque={queryStore.hasQuery} />
        </BlockTop>
        <BlockBottom
          above={60}
          height={appStore.contentHeight}
          maxHeight={window.innerHeight - 20}
          overflow={SHADOW_PAD}
        >
          <OrbitChrome moreOpaque={queryStore.hasQuery} />
        </BlockBottom>
      </>
    )
  },
)
