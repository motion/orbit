import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/stores'
import { ControlButton } from '../../views/ControlButton'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { AppStore } from '../../stores/AppStore'
import { OrbitStore } from './OrbitStore'
import { OrbitHeaderInput } from './orbitHeader/OrbitHeaderInput'
import { HeaderStore } from './HeaderStore'

const OrbitHeaderContainer = view({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  padding: [6, 12],
  transition: 'all ease-in 300ms',
  zIndex: 4,
})

OrbitHeaderContainer.theme = ({ borderRadius, theme }) => ({
  borderTopRadius: borderRadius,
  background: theme.base.background,
})

const PinnedControlButton = view(ControlButton, {
  position: 'relative',
  zIndex: 10000,
  transition: 'all ease-in 100ms 100ms',
  marginRight: 12,
  opacity: 0.2,
  '&:hover': {
    opacity: 0.4,
  },
  isPinned: {
    opacity: 1,
  },
  onLeft: {
    right: 3,
  },
  onRight: {
    left: 0,
  },
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

@attachTheme
@view.attach('orbitStore', 'appStore', 'paneStore')
@view.attach({
  headerStore: HeaderStore,
})
@view
export class OrbitHeader extends React.Component<{
  headerStore?: HeaderStore
  paneStore?: OrbitDockedPaneStore
  appStore?: AppStore
  orbitStore?: OrbitStore
  after?: React.ReactNode
  borderRadius: number
}> {
  hoverSettler = this.props.appStore.getHoverSettler({
    onHover: this.props.headerStore.hover,
  })

  render() {
    const {
      paneStore,
      orbitStore,
      headerStore,
      after,
      theme,
      showPin,
      borderRadius,
    } = this.props
    const headerBg = theme.base.background
    const isHome = paneStore.activePane === 'home'
    const { iconHovered } = headerStore
    return (
      <OrbitHeaderContainer
        headerBg={headerBg}
        {...this.hoverSettler.props}
        borderRadius={borderRadius}
      >
        <Title>
          <UI.Icon
            name={
              isHome && iconHovered
                ? 'remove'
                : !isHome && iconHovered
                  ? 'home'
                  : 'ui-1_zoom'
            }
            size={18}
            color={theme.base.color}
            onMouseEnter={headerStore.onHoverIcon}
            onMouseLeave={headerStore.onUnHoverIcon}
            onClick={headerStore.goHome}
            height="100%"
            width={30}
            opacity={0.2}
            cursor="pointer"
            hover={{
              opacity: 1,
            }}
          />
          <OrbitHeaderInput
            headerStore={headerStore}
            orbitStore={orbitStore}
            theme={theme}
          />
        </Title>
        <After if={after}>{after}</After>
        <PinnedControlButton
          if={showPin}
          onClick={App.togglePinned}
          borderWidth={App.orbitState.pinned ? 0.5 : 2}
          onLeft={App.orbitOnLeft}
          onRight={!App.orbitOnLeft}
          isPinned={App.orbitState.pinned}
          background={App.orbitState.pinned ? '#7954F9' : 'transparent'}
          borderColor={
            App.orbitState.pinned
              ? null
              : theme.base.background.darken(0.4).desaturate(0.6)
          }
          css={{
            opacity: App.orbitState.hidden ? 0 : 1,
          }}
        />
      </OrbitHeaderContainer>
    )
  }
}
