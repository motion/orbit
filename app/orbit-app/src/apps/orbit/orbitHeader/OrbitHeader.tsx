import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { HeaderStore } from './HeaderStore'
import { HeaderProps } from './HeaderProps'
import { View, Image, Tooltip, Popover, Row, Col, Text, Icon } from '@mcro/ui'
import orbIcon from '../../../../public/orb.svg'
import { Desktop } from '@mcro/stores'
import { Actions } from '../../../actions/Actions'

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
            <Popover
              openOnClick
              adjust={[65, 0]}
              theme="light"
              borderRadius={5}
              width={200}
              background="#fff"
              target={
                <Image
                  src={orbIcon}
                  width={20}
                  height={20}
                  margin={['auto', 10]}
                  onMouseEnter={headerStore.onHoverIcon}
                  onMouseLeave={headerStore.onUnHoverIcon}
                  onClick={headerStore.onClickOrb}
                  opacity={Desktop.ocrState.paused ? 0.3 : 1}
                  transform={{
                    y: -0.5,
                  }}
                  {...{
                    '&:hover': {
                      opacity: Desktop.ocrState.paused ? 0.6 : 1,
                    },
                  }}
                />
              }
            >
              <Row flex={1} padding={[8, 10]} alignItems="center">
                <View borderRadius={100} background="blue" marginRight={5} width={16} height={16} />
                <Col flex={1}>
                  <Text sizeLineHeight={0.8} size={1} fontWeight={600}>
                    Orbit
                  </Text>
                  <Text sizeLineHeight={0.8} size={0.9} alpha={0.5}>
                    20 people
                  </Text>
                </Col>
                <Icon name="gear" size={14} opacity={0.5} />
              </Row>
            </Popover>
            <OrbitHeaderInput headerStore={headerStore} theme={theme} />
          </Title>
          {!!after && <After>{after}</After>}
        </OrbitFakeInput>
      </OrbitHeaderContainer>
    )
  }
}
