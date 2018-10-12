import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { HeaderStore } from './HeaderStore'
import { HeaderProps } from './HeaderProps'
import { View } from '@mcro/ui'
import { Desktop } from '@mcro/stores'
import { Actions } from '../../../actions/Actions'
import { OrbitSpaceSwitch } from '../orbitDocked/orbitHome/OrbitSpaceSwitch'

const OrbitHeaderContainer = view(View, {
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  padding: [9, 9, 7, 9],
  transition: 'all ease-in 300ms',
  zIndex: 4,
})

const After = view({
  alignItems: 'center',
  flexFlow: 'row',
})

const Title = view({
  flexFlow: 'row',
  flex: 1,
  justifyContent: 'stretch',
  alignItems: 'stretch',
})

const OrbitFakeInput = view({
  height: 43,
  flex: 1,
  flexFlow: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  transition: 'background ease-in 200ms 200ms',
  borderRadius: 10,
  inactive: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}).theme(({ theme }) => ({
  background: theme.inputBackground || theme.background.alpha(0.35),
  '&:active': {
    background: theme.inputBackgroundActive || theme.background.alpha(0.6),
  },
}))

const OrbitCloseControl = view({
  width: 8,
  height: 8,
  borderRadius: 50,
  boxSizing: 'content-box',
  zIndex: 10000,
})

const OrbitClose = view({
  position: 'absolute',
  top: 3,
  left: 3,
  padding: 6,
}).theme(({ theme }) => {
  const isDark = theme.background.isDark()
  return {
    '& > div': {
      background: isDark ? 'transparent' : [230, 230, 230, 0.25],
    },
    '&:hover > div': {
      background: isDark ? '#fff' : '#000',
    },
  }
})

const Disable = view({
  flex: 'inherit',
  when: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
})

@attachTheme
@view.attach('paneManagerStore', 'selectionStore', 'searchStore', 'queryStore')
@view.attach({
  headerStore: HeaderStore,
})
@view
export class OrbitHeader extends React.Component<
  HeaderProps & {
    headerStore?: HeaderStore
    after?: React.ReactNode
    borderRadius?: number
    theme?: ThemeObject
    showPin?: boolean
  }
> {
  render() {
    const { headerStore, paneManagerStore, after, theme, borderRadius } = this.props
    const headerBg = theme.background
    console.log('render OrbitHeader')
    return (
      <OrbitHeaderContainer
        headerBg={headerBg}
        borderRadius={borderRadius}
        opacity={paneManagerStore.shouldOnboard ? 0 : 1}
      >
        <OrbitFakeInput>
          <Title>
            <OrbitClose onClick={Actions.closeOrbit}>
              <OrbitCloseControl />
            </OrbitClose>
            <OrbitSpaceSwitch
              onClick={headerStore.onClickOrb}
              margin={['auto', 0]}
              transform={{
                y: -0.5,
              }}
              {...{
                '&:hover': {
                  opacity: Desktop.ocrState.paused ? 0.6 : 1,
                },
              }}
            />
            <Disable when={paneManagerStore.activePane === 'settings'}>
              <OrbitHeaderInput headerStore={headerStore} theme={theme} />
            </Disable>
          </Title>
          {!!after && <After>{after}</After>}
        </OrbitFakeInput>
      </OrbitHeaderContainer>
    )
  }
}
