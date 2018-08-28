import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { HeaderStore } from './HeaderStore'
import { HeaderProps } from './HeaderProps'
import { View } from '@mcro/ui'

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
  transition: 'background ease-in 300ms',
  borderRadius: 10,
})
OrbitFakeInput.theme = ({ theme }) => ({
  background: theme.inputBackground || theme.background.alpha(0.35),
  '&:active': {
    background: theme.inputBackgroundActive || theme.background.alpha(0.6),
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
    theme?: Object
    showPin?: boolean
  }
> {
  render() {
    const {
      headerStore,
      paneManagerStore,
      after,
      theme,
      borderRadius,
    } = this.props
    const headerBg = theme.background
    return (
      <OrbitHeaderContainer
        headerBg={headerBg}
        borderRadius={borderRadius}
        opacity={paneManagerStore.shouldOnboard ? 0 : 1}
      >
        <OrbitFakeInput>
          <Title>
            <UI.Icon
              name={'ui-1_zoom'}
              size={17}
              onMouseEnter={headerStore.onHoverIcon}
              onMouseLeave={headerStore.onUnHoverIcon}
              onClick={headerStore.goHome}
              height="100%"
              width={40}
              opacity={0.2}
              margin={[0, -4, 0, 0]}
              transform={{
                y: -0.5,
              }}
              {...{
                '&:hover': {
                  opacity: 0.4,
                },
              }}
            />
            <OrbitHeaderInput headerStore={headerStore} theme={theme} />
          </Title>
          {!!after && <After>{after}</After>}
        </OrbitFakeInput>
      </OrbitHeaderContainer>
    )
  }
}
